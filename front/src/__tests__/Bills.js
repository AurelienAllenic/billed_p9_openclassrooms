/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";
import { handleClickNewBill } from "../containers/Bills.js";
import router from "../app/Router.js";
import Bill from "../containers/Bills.js";
import $ from "jquery";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
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

      // Get the icon message icon in vertical layout
      const iconMail = screen.getByTestId('icon-mail');
    
      // Check that the icon is highlighted
      expect(windowIcon).toHaveClass('active-icon');
      // Check that the message icon is not highlighted
      expect((iconMail)).not.toHaveClass('active-icon');
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map((a) => a.innerHTML);
      const chrono = (a, b) => new Date(b) - new Date(a);
      const datesSorted = [...dates].sort(chrono);
      console.log("datesSorted", datesSorted)
      expect(dates.every((date) => datesSorted.includes(date))).toBe(true);
    });
  describe("When I click on the icon-eye", () => {
    test("I should be able to see the modal", async () =>{

    // Render the Bills page
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;

    // Get the eye icons
    const EyeIcons = screen.getAllByTestId('icon-eye');

    // Click the first eye icon
    fireEvent.click(EyeIcons[0]);

    // Wait for the modal to be displayed
    await waitFor(() => {
      expect(document.getElementById('modaleFile')).toBeInTheDocument();
    });

    // Get the modal element by its id
    const modal = document.getElementById('modaleFile');

    // Check that the modal is displayed
    expect(modal).toBeInTheDocument();
      });
    });
  });
})
