import { Dispatcher } from "flux";

const dispatcher = new Dispatcher();

export const InvoiceActions = {
  createInvoice(invoice) {
    dispatcher.dispatch({ type: "CREATE_INVOICE", invoice });
  },
  updateInvoiceStatus(id, status) {
    dispatcher.dispatch({ type: "UPDATE_INVOICE_STATUS", id, status });
  },
};

export default dispatcher;