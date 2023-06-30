import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    $('#modaleFile').modal('show')
  }

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => {
            try {
              if(doc.date === null){
                doc.date= '1970-01-01';
                const formattedDate = formatDate(doc.date);
                return {
                  ...doc,
                  date: formattedDate,
                  status: "incomplet",
                };

              }else{
                 console.log('Formatting date for:', doc.date);
              const formattedDate = formatDate(doc.date);
              console.log("ourformattedDate", formatDate(doc.date))
              console.log('Formatted date:', formattedDate);
              return {
                ...doc,
                date: formattedDate,
                status: formatStatus(doc.status),
              };
              }
             
            } catch (e) {
              console.log(e, 'for', doc);
              return {
                ...doc,
                date: doc.date, // Provide a fallback value here
                status: formatStatus(doc.status),
              };
            }
          });
          console.log('length', bills.length);
          return bills;
        });
    }
  };  
};  