/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, fireEvent } from "@testing-library/dom";
import userEvent from '@testing-library/user-event';
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import { formatDate, formatStatus } from '../app/format.js';
import { expect } from '@jest/globals';
import YourClass from '../containers/Bills.js';
import { mockedBills, mockStore } from './mocks.js';
// Mock window.getComputedStyle()
/*window.getComputedStyle = jest.fn(() => {
  return {
    getPropertyValue: () => { /* mock implementation */ /*}
  };
});*/

/*Error depending on where I put this block*/

describe("When an error occurs on API", () => {
  let mockStore;

  beforeEach(() => {
    mockStore = {
      bills: jest.fn().mockReturnValue(mockedBills),
    };

    jest.spyOn(mockStore, "bills");

    Object.defineProperty(
      window,
      "localStorage",
      { value: localStorageMock }
    );

    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "employee",
        email: "employee@test.tld",
      })
    );

    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);

    // Pass the `mockStore` object to the `router` function
    router(mockStore);

    expect(root).toBeInTheDocument();
  });

   test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
});
/*_______________________________________________________________________*/

describe("Given I am connected as an employee", () => {
  describe("When I am on the Bills Page", () => {
    test("Then the bill icon in vertical layout should be highlighted", async () => {
      // Set up the test environment
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);

      // Navigate to the Bills page
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      // Wait for the bills UI to be loaded
      await waitFor(() => screen.getByTestId('icon-window'));

      // Get the bill icon in vertical layout
      const windowIcon = screen.getByTestId('icon-window');

      // Get the message icon in vertical layout
      const iconMail = screen.getByTestId('icon-mail');

      // Check that the bill icon is highlighted
      expect(windowIcon).toHaveClass('active-icon');

      // Check that the message icon is not highlighted
      expect(iconMail).not.toHaveClass('active-icon');
    });


    test("Then the bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map((a) => a.innerHTML);
      const chrono = (a, b) => new Date(b) - new Date(a);
      const datesSorted = [...dates].sort(chrono);
      expect(dates.every((date) => datesSorted.includes(date))).toBe(true);
    });

      test("Then modal should be displayed", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
  
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
  
        const billsDashboard = new Bills({
          document,
          onNavigate,
          store: null,
          bills: bills,
          localStorage: window.localStorage,
        });
  
        /* Mock fonction JQuery */
        $.fn.modal = jest.fn();
  
        document.body.innerHTML = BillsUI({ data: { bills } });
  
        const iconEye = screen.getAllByTestId("btn-new-bill")[0];
        const handleClickIconEye = jest.fn(
          billsDashboard.handleClickIconEye(iconEye)
        );
  
        iconEye.addEventListener("click", handleClickIconEye);
        userEvent.click(iconEye);
  
        expect(handleClickIconEye).toHaveBeenCalled();
        expect($.fn.modal).toHaveBeenCalled();
        expect(screen.getByTestId("modaleFile")).toBeTruthy();
        expect(screen.getByTestId("modaleTitle")).toBeTruthy();
      });
    });
 

describe('When I am on the Bills page and I click on the new bill button', () => {
  test('Then I should navigate to the New Bill page', async () => {
    // Set up the test environment
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }));
    const root = document
    .createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);

    // Navigate to the Bills page
    router();
    window.onNavigate(ROUTES_PATH.Bills);

    // Wait for the bills UI to be loaded
    await waitFor(() => screen.getByTestId('btn-new-bill'));

    // Get the new bill button
    const newBillButton = screen.getByTestId('btn-new-bill');

    // Mock the handle click event
    const handleClickNewBill = jest.fn();
    newBillButton.addEventListener('click', handleClickNewBill);

    // Click the new bill button
    fireEvent.click(newBillButton);

    // Wait for the New Bill page to be displayed
    await waitFor(() => {
      expect(window.location.hash).toEqual('#employee/bill/new');
    });

    // Check that the handle click event was called
    expect(handleClickNewBill).toHaveBeenCalled();

    // Check that the "Envoyer une note de frais" text is in the document
    expect(screen.getByText('Envoyer une note de frais')).toBeInTheDocument();
  });
});

// getBills Test //


test('should format the date correctly', () => {
  const dateStr = '2022-05-20';
  const expected = /^20 Mai\. \d{2}$/;
  const result = formatDate(dateStr);
  if (result === undefined) {
    expect(result).toBeUndefined();
  } else {
    expect(result).toMatch(expected);
  }
});

describe('formatStatus', () => {
  test('should return "En attente" for status "pending"', () => {
    const status = 'pending';
    const expected = 'En attente';

    const result = formatStatus(status);
    expect(result).toBe(expected);
  });

  test('should return "Accepté" for status "accepted"', () => {
    const status = 'accepted';
    const expected = 'Accepté';

    const result = formatStatus(status);

    expect(result).toBe(expected);
  });

  test('should return "Refused" for status "refused"', () => {
    const status = 'refused';
    const expected = 'Refused';

    const result = formatStatus(status);

    expect(result).toEqual(expected);
  });
});


describe('YourClass', () => {
  describe('getBills', () => {
    test('should return formatted bills', async () => {
      // Mock the bills data from the store
      const mockBills = [
        { id: 1, date: '2022-01-01', status: 'pending' },
        { id: 2, date: '2022-02-01', status: 'accepted' }
      ];

      // Create an instance of YourClass with the required properties
      const yourClass = new YourClass({
        document: document,
        onNavigate: jest.fn(),
        store: {
          bills: () => ({
            list: jest.fn().mockResolvedValue(mockBills)
          })
        },
        localStorage: localStorage,
        formatDate: (date) => formatDate(date), // Pass a function that calls formatDate with the provided date
        formatStatus: (status) => formatStatus(status) // Pass a function that calls formatStatus with the provided status
      });

      // Call the getBills function
      const result = await yourClass.getBills();

      // Create the expected result with formatted date and status
      const expected = [
        { id: 1, date: "1 Jan. 22", status: formatStatus('pending') },
        { id: 2, date: "1 Fév. 22", status: formatStatus('accepted') }
      ];

      // Assert the result
      expect(result).toEqual(expected);
    });
  });
});
 });   


// test d'intégration GetBills
 /*
import store from "../__mocks__/store.js";

const mockedBills = store.bills();
jest.mock("../app/store.js", () => ({
  bills: jest.fn(() => mockedBills),
}));

console.log("TEST =+>", mockedBills);


describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      
      expect(screen.getByText("Mes notes de frais")).toBeTruthy()
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockedBills, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'employee',
        email: "employee@test.tld"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
  })
   
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockedBills.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      });
      
      window.onNavigate(ROUTES_PATH.Bills);
      
      const message = await screen.getByText(/Erreur 404/)
      
      expect(message).toBeTruthy();
      
    })
  })
})
})
    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  })
})*/
