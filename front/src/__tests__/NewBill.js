/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe('NewBill', () => {
  let newBill;

  beforeEach(() => {
    

    const document = {
      querySelector: jest.fn(() => ({
        addEventListener: jest.fn(),
      })),
    };

    const store = {
      bills: jest.fn(() => ({
        create: jest.fn(() => ({
          fileUrl: 'mock-file-url',
          key: 'mock-key',
        })),
      })),
    };

    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));

    const onNavigate = jest.fn();

    newBill = new NewBill({ document, onNavigate, store, localStorage });
  });

  describe('handleChangeFile', () => {
    test('should handle file change and set fileUrl, fileName, and billId', async () => {
      global.alert = jest.fn();

      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'mock-file-path',
        },
      };

      const file = {
        name: 'mock-file-name.jpg',
      };

      const fileInput = {
        files: [file],
      };

      newBill.document.querySelector.mockReturnValue(fileInput);

      global.FormData = jest.fn(() => ({
        append: jest.fn(),
      }));

      await newBill.handleChangeFile(event);

      expect(newBill.document.querySelector).toHaveBeenCalledWith('input[data-testid="file"]');
      expect(newBill.document.querySelector).toHaveBeenCalledWith('input[data-testid="file"]');
      expect(newBill.document.querySelector).toHaveBeenCalledWith('input[data-testid="file"]');
      expect(screen.getByText(/Invalid file format\. Please choose a JPEG, PNG, or JPG file\./)).toBeInTheDocument();
      expect(fileInput.value).toBe('');

      expect(global.FormData).toHaveBeenCalled();
      expect(global.FormData().append).toHaveBeenCalledWith('file', file);
      expect(global.FormData().append).toHaveBeenCalledWith('email', 'test@example.com');

      expect(newBill.store.bills().create).toHaveBeenCalledWith({
        data: global.FormData(),
        headers: {
          noContentType: true,
        },
      });

      expect(newBill.fileUrl).toBe('mock-file-url');
      expect(newBill.fileName).toBe('mock-file-name.jpg');
      expect(newBill.billId).toBe('mock-key');
    });
  });

  describe('handleSubmit', () => {
    test('should handle form submit and update bill', () => {
      const event = {
        preventDefault: jest.fn(),
        target: {
          querySelector: jest.fn((selector) => {
            if (selector === 'input[data-testid="datepicker"]') {
              return {
                value: '2022-01-01',
              };
            }
            if (selector === 'select[data-testid="expense-type"]') {
              return {
                value: 'food',
              };
            }
            if (selector === 'input[data-testid="expense-name"]') {
              return {
                value: 'Mock Expense',
              };
            }
            if (selector === 'input[data-testid="amount"]') {
              return {
                value: '100',
              };
            }
          }),
        },
      };

      newBill.billId = 'mock-key';
      newBill.updateBill = jest.fn();

      newBill.handleSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(newBill.updateBill).toHaveBeenCalledWith('mock-key', {
        date: '2022-01-01',
        type: 'food',
        name: 'Mock Expense',
        amount: '100',
      });
    });
  });
});
