/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should be able to submit a new bill", async () => {
      // Mock store and localStorage
      const store = {
        bills: jest.fn().mockReturnValue({
          create: jest.fn().mockImplementation(formData => {
            console.log("create mock implementation called with formData:", formData);
            // Simulate successful bill creation
            const mockedBill = {
              fileUrl: "mocked-file-url",
              key: "mocked-bill-id",
            };
            return Promise.resolve(mockedBill);
          }),
          update: jest.fn().mockResolvedValue({}),
        }),
      };


      const localStorageMock = {
        getItem: jest.fn().mockReturnValueOnce(
          JSON.stringify({ email: "mocked-email" })
        ),
      };

      const documentBody = document.createElement("body");
      documentBody.setAttribute("id", "root");
      document.body = documentBody;
      const onNavigate = jest.fn();
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock,
      });

      document.body.innerHTML = NewBillUI();

      // Simulate user interaction and form submission
      const expenseTypeSelect = screen.getByTestId('expense-type');
      fireEvent.change(expenseTypeSelect, { target: { value: 'mocked-type' } });

      const expenseNameInput = screen.getByTestId('expense-name');
      fireEvent.change(expenseNameInput, { target: { value: 'mocked-name' } });

      const amountInput = screen.getByTestId('amount');
      fireEvent.change(amountInput, { target: { value: '100' } });

      const datePickerInput = screen.getByTestId('datepicker');
      fireEvent.change(datePickerInput, { target: { value: '2023-06-15' } });

      const vatInput = screen.getByTestId('vat');
      fireEvent.change(vatInput, { target: { value: '20' } });

      const pctInput = screen.getByTestId('pct');
      fireEvent.change(pctInput, { target: { value: '20' } });

      const commentaryTextarea = screen.getByTestId('commentary');
      fireEvent.change(commentaryTextarea, { target: { value: 'mocked-comment' } });

      // Simulate file upload
      const fileInput = screen.getByTestId('file');
      const mockedFile = new File(['mocked file content'], 'mocked-file.jpg', { type: 'image/jpeg' });
      Object.defineProperty(fileInput, 'files', { value: [mockedFile] });
      fireEvent.change(fileInput);

      // Simulate form submission
      const form = screen.getByTestId('form-new-bill');
      const handleSubmit = jest.fn(newBillContainer.handleSubmit);
      form.addEventListener('submit', handleSubmit);
      fireEvent.submit(form);

      // Assertions
      expect(handleSubmit).toHaveBeenCalled();
      expect(store.bills().create).toHaveBeenCalledTimes(1);
      expect(store.bills().create).toHaveBeenCalledWith({
        data: expect.any(FormData),
        headers: { noContentType: true }
      });
      expect(store.bills().update).toHaveBeenCalledTimes(1);
      expect(store.bills().update).toHaveBeenCalledWith({
        selector: "mocked-bill-id",
        data: expect.any(String),
      });
      expect(onNavigate).toHaveBeenCalledTimes(1);
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.Bills);
    });
  });
});