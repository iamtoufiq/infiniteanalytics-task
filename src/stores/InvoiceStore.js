import { EventEmitter } from "events";
import dispatcher from "../actions/InvoiceActions";
import { staticInvoices } from "../utils/invoiceData";

const InvoiceStore = () => {
  const store = new EventEmitter();
  let invoices = [...staticInvoices];

  store.createInvoice = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: Date.now(),
      status: "outstanding",
      createdAt: new Date().toISOString().split("T")[0],
    };
    invoices.push(newInvoice);
    store.emit("change");
  };

  store.updateInvoiceStatus = (id, status) => {
    const invoice = invoices.find((inv) => inv.id === id);
    if (invoice) {
      invoice.status = status;
      store.emit("change");
    }
  };

  store.getAllInvoices = () => [...invoices];
  store.getLateInvoices = () =>
    invoices.filter((invoice) => invoice.status === "late");
  store.getPaidInvoices = () =>
    invoices.filter((invoice) => invoice.status === "paid");
  store.getOutstandingInvoices = () =>
    invoices.filter((invoice) => invoice.status === "outstanding");
  store.getInvoicesByDateRange = (startDate, endDate) => {
    return invoices.filter((invoice) => {
      const dueDate = new Date(invoice.dueDate);
      return (
        (!startDate || dueDate >= new Date(startDate)) &&
        (!endDate || dueDate <= new Date(endDate))
      );
    });
  };

  store.handleActions = (action) => {
    switch (action.type) {
      case "CREATE_INVOICE":
        store.createInvoice(action.invoice);
        break;
      case "UPDATE_INVOICE_STATUS":
        store.updateInvoiceStatus(action.id, action.status);
        break;
      default:
        break;
    }
  };

  dispatcher.register(store.handleActions);
  return store;
};

export default InvoiceStore();