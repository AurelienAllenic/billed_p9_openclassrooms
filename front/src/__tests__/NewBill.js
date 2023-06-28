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
/*
// handleChangeFile
describe('handleChangeFile', () => {
  let instance;
  let store;

  beforeEach(() => {
    instance = new NewBill();
    store = {
      bills: jest.fn(() => ({
        create: jest.fn(() => ({
          fileUrl: 'https://example.com/image.jpg',
          key: '123',
        })),
      })),
    };
    instance.store = store;
    instance.document = {
      querySelector: jest.fn(() => ({
        files: [{ name: 'test.jpg' }],
      })),
    };
    instance.localStorage = {
      getItem: jest.fn(() => JSON.stringify({ email: 'test@example.com' })),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a valid file', async () => {
    const event = { preventDefault: jest.fn(), target: { value: 'C:\\fakepath\\test.jpg' } };
    const formData = new FormData();
    formData.append('file', { name: 'test.jpg' });
    formData.append('email', 'test@example.com');

    await instance.handleChangeFile(event);

    expect(store.bills).toHaveBeenCalled();
    expect(store.bills().create).toHaveBeenCalledWith({
      data: formData,
      headers: {
        noContentType: true,
      },
    });
  });

  it('should not upload an invalid file', async () => {
    const event = { preventDefault: jest.fn(), target: { value: 'C:\\fakepath\\test.gif' } };
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    instance.document.querySelector.mockReturnValueOnce({
      files: [{ name: 'test.gif' }],
    });

    await instance.handleChangeFile(event);

    expect(alertSpy).toHaveBeenCalledWith('Invalid file format. Please choose a JPEG, PNG, or JPG file.');
    expect(store.bills().create).not.toHaveBeenCalled();
  });

  it('should reset the file input after an invalid file is selected', async () => {
    const event = { preventDefault: jest.fn(), target: { value: 'C:\\fakepath\\test.gif' } };
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    instance.document.querySelector.mockReturnValueOnce({
      files: [{ name: 'test.gif' }],
      value: 'C:\\fakepath\\test.gif',
    });

    await instance.handleChangeFile(event);

    expect(instance.document.querySelector).toHaveBeenCalledWith(`input[data-testid="file"]`);
    expect(instance.document.querySelector().value).toEqual('');
  });

  it('should log the file and fileUrl after a successful upload', async () => {
    const event = { preventDefault: jest.fn(), target: { value: 'C:\\fakepath\\test.jpg' } };

    await instance.handleChangeFile(event);

    expect(console.log).toHaveBeenCalledWith({ name: 'test.jpg' });
    expect(console.log).toHaveBeenCalledWith('https://example.com/image.jpg');
  });

  it('should set the billId, fileUrl, and fileName after a successful upload', async () => {
    const event = { preventDefault: jest.fn(), target: { value: 'C:\\fakepath\\test.jpg' } };

    await instance.handleChangeFile(event);

    expect(instance.billId).toEqual('123');
    expect(instance.fileUrl).toEqual('https://example.com/image.jpg');
    expect(instance.fileName).toEqual('test.jpg');
  });

  it('should catch and log any errors that occur during the upload', async () => {
    const event = { preventDefault: jest.fn(), target: { value: 'C:\\fakepath\\test.jpg' } };
    store.bills().create.mockRejectedValueOnce(new Error('Upload failed'));
    it('should catch and log any errors that occur during the upload', async () => {
      const event = { preventDefault: jest.fn(), target: { value: 'C:\\fakepath\\test.jpg' } };
      store.bills().create.mockRejectedValueOnce(new Error('Upload failed'));

      await instance.handleChangeFile(event);

      expect(console.error).toHaveBeenCalledWith(new Error('Upload failed'));
    });
});
})
*/
