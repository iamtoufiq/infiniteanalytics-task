import { EventEmitter } from 'events';
import dispatcher from '../actions/InvoiceActions';

const staticInvoices = [
  { id: 1, items: [{ description: 'Web Design', type: 'labor', rate: 50, quantity: 4 }, { description: 'Travel', type: 'expense', rate: 30, quantity: 1 }], notes: 'Please send check to 123 Infinite St., Tech City', status: 'outstanding', dueDate: '2025-03-20', createdAt: '2025-03-14' },
  { id: 2, items: [{ description: 'Consulting', type: 'labor', rate: 60, quantity: 2 }], notes: 'Pay via bank transfer to account #987654', status: 'paid', dueDate: '2025-03-10', createdAt: '2025-03-01' },
  { id: 3, items: [{ description: 'Development', type: 'labor', rate: 70, quantity: 3 }, { description: 'Materials', type: 'material', rate: 25, quantity: 1 }], notes: 'Payment due within 15 days', status: 'late', dueDate: '2025-03-12', createdAt: '2025-03-05' }
];

const InvoiceStore = () => {
  const store = new EventEmitter();
  let invoices = [...staticInvoices];

  store.createInvoice = (invoice) => {
    const newInvoice = { ...invoice, id: Date.now(), status: 'outstanding', createdAt: new Date().toISOString().split('T')[0] };
    invoices.push(newInvoice);
    store.emit('change');
  };

  store.updateInvoiceStatus = (id, status) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      invoice.status = status;
      store.emit('change');
    }
  };

  store.getAllInvoices = () => [...invoices];
  store.getLateInvoices = () => invoices.filter(invoice => invoice.status === 'late');
  store.getPaidInvoices = () => invoices.filter(invoice => invoice.status === 'paid');
  store.getOutstandingInvoices = () => invoices.filter(invoice => invoice.status === 'outstanding');
  store.getInvoicesByDateRange = (startDate, endDate) => {
    return invoices.filter(invoice => {
      const dueDate = new Date(invoice.dueDate);
      return (!startDate || dueDate >= new Date(startDate)) && (!endDate || dueDate <= new Date(endDate));
    });
  };

  store.handleActions = (action) => {
    switch (action.type) {
      case 'CREATE_INVOICE': store.createInvoice(action.invoice); break;
      case 'UPDATE_INVOICE_STATUS': store.updateInvoiceStatus(action.id, action.status); break;
      default: break;
    }
  };

  dispatcher.register(store.handleActions);
  return store;
};

export default InvoiceStore();