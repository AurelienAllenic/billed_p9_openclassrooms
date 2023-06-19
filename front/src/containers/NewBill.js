import { ROUTES_PATH } from '../constants/routes.js';
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });

    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`);
    if (formNewBill) formNewBill.addEventListener("submit", this.handleSubmit);

    const file = this.document.querySelector(`input[data-testid="file"]`);
    if (file) file.addEventListener("change", this.handleChangeFile);
  }

  handleChangeFile = async (e) => {
    e.preventDefault();
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];

    // Validate file extension
    const allowedExtensions = ['jpeg', 'png', 'jpg'];
    const fileNameParts = file.name.split('.');
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert('Invalid file format. Please choose a JPEG, PNG, or JPG file.');
      fileInput.value = ''; // Reset the file input
      return;
    }

    console.log(file);

    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    const formData = new FormData();
    const email = JSON.parse(localStorage.getItem('user')).email;
    formData.append('file', file);
    formData.append('email', email);

    try {
      const { fileUrl, key } = await this.store.bills().create({
        data: formData,
        headers: {
          noContentType: true,
        },
      });

      console.log(fileUrl);
      this.billId = key;
      this.fileUrl = fileUrl;
      this.fileName = fileName;
    } catch (error) {
      console.error(error);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append('fileUrl', this.fileUrl);
    formData.append('fileName', this.fileName);
    formData.append('id', this.billId);

    try {
      await this.store.bills().update({
        data: JSON.stringify(formData),
        selector: this.billId,
      });
      this.onNavigate(ROUTES_PATH.Bills);
    } catch (error) {
      console.error(error);
    }
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store.bills
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH.Bills);
        })
        .catch((error) => console.error(error));
    }
  };
}
