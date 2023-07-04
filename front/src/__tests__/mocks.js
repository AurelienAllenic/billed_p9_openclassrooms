import store from "../__mocks__/store.js";

export const mockedBills = store.bills();
export const mockStore = {
  bills: jest.fn(() => mockedBills),
};
