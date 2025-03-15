import { EventEmitter } from 'events';
import dispatcher from '../actions/InvoiceActions';

const staticInvoices = [
  {
    id: 1,
    items: [
      { description: 'Web Design', rate: 50, hours: 4 },
      { description: 'Travel Expense', rate: 30, hours: 1 }
    ],
    notes: 'Please send check to 123 Infinite St., Tech City',
    status: 'outstanding',
    dueDate: '2025-03-20',
    createdAt: '2025-03-14'
  },
  {
    id: 2,
    items: [
      { description: 'Consulting', rate: 60, hours: 2 }
    ],
    notes: 'Pay via bank transfer to account #987654',
    status: 'paid',
    dueDate: '2025-03-10',
    createdAt: '2025-03-01'
  },
  {
    id: 3,
    items: [
      { description: 'Development', rate: 70, hours: 3 },
      { description: 'Materials', rate: 25, hours: 1 }
    ],
    notes: 'Payment due within 15 days',
    status: 'late',
    dueDate: '2025-03-12',
    createdAt: '2025-03-05'
  }
];

const InvoiceStore = () => {
  const store = new EventEmitter();
  let invoices = [...staticInvoices];

  store.createInvoice = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: Date.now(),
      status: 'outstanding',
      createdAt: new Date().toISOString().split('T')[0]
    };
    invoices.push(newInvoice);
    console.log('New invoice added:', newInvoice);
    store.emit('change');
  };

  store.updateInvoiceStatus = (id, status) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      invoice.status = status;
      console.log(`Updated invoice ${id} to status: ${status}`);
      store.emit('change');
    }
  };

  store.getAllInvoices = () => [...invoices];

  store.getLateInvoices = () => {
    const lateInvoices = invoices.filter(
      invoice => invoice.status === 'late'
    );
    console.log('Late invoices:', lateInvoices);
    return lateInvoices;
  };

  store.handleActions = (action) => {
    switch (action.type) {
      case 'CREATE_INVOICE':
        store.createInvoice(action.invoice);
        break;
      case 'UPDATE_INVOICE_STATUS':
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