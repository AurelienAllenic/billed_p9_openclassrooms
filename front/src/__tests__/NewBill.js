import { screen, waitForElementToBeRemoved, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";
import NewBill from "../containers/NewBill.js";
import router from "../app/Router.js";
import { waitFor } from "@testing-library/dom";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should be able to submit a new bill", async () => {
      // Set up the test environment
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const html = NewBillUI();
      const root = document.createElement("div");
      root.innerHTML = html;
      document.body.appendChild(root);
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const firestore = null;
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
    
      // Wait for the expense-type element to appear
      await waitFor(() => screen.getByTestId("expense-type"));
    
      // Fill in the form fields
      const expenseType = screen.getByTestId("expense-type");
      fireEvent.change(expenseType, { target: { value: "Transports" } });
      expect(expenseType.value).toBe("Transports");
    
      const datePicker = screen.getByTestId("datepicker");
      fireEvent.change(datePicker, { target: { value: "2021-05-20" } });
      expect(datePicker.value).toBe("2021-05-20");
    
      const amountInput = screen.getByTestId("amount");
      fireEvent.change(amountInput, { target: { value: "100" } });
      expect(amountInput.value).toBe("100");
    
      const vatInput = screen.getByTestId("vat");
      fireEvent.change(vatInput, { target: { value: "20" } });
      expect(vatInput.value).toBe("20");
    
      const commentaryInput = screen.getByTestId("commentary");
      fireEvent.change(commentaryInput, { target: { value: "Test bill" } });
      expect(commentaryInput.value).toBe("Test bill");
    
      // Submit the form
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const form = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
    
      // Check that the form is submitted correctly
      expect(handleSubmit).toHaveBeenCalled();
    });    
  });
});

// handleChangeFile
