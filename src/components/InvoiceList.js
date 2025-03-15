import React, { useState, useEffect } from 'react';
import invoiceStore from '../stores/InvoiceStore';
import { InvoiceActions } from '../actions/InvoiceActions';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState(invoiceStore.getAllInvoices());
  const [showLateOnly, setShowLateOnly] = useState(false);

  useEffect(() => {
    const updateInvoices = () => {
      const newInvoices = showLateOnly ? invoiceStore.getLateInvoices() : invoiceStore.getAllInvoices();
      setInvoices(newInvoices);
    };
    invoiceStore.on('change', updateInvoices);
    updateInvoices();
    return () => invoiceStore.off('change', updateInvoices);
  }, [showLateOnly]);

  const handleStatusChange = (id) => (e) => {
    InvoiceActions.updateInvoiceStatus(id, e.target.value);
  };

  const calculateTotal = (items) => items.reduce((sum, item) => sum + (item.rate * item.hours), 0);

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'outstanding': return 'status-outstanding';
      case 'late': return 'status-late';
      default: return '';
    }
  };

  return (
    <div className="invoice-list">
      <h2>Invoices</h2>
      <label className="filter-checkbox">
        <input type="checkbox" checked={showLateOnly} onChange={(e) => setShowLateOnly(e.target.checked)} />
        Show Late Invoices Only
      </label>
      {invoices.length === 0 ? (
        <p className="no-invoices">No invoices to display</p>
      ) : (
        <div className="invoices-container">
          {invoices.map(invoice => (
            <div key={invoice.id} className="invoice-card">
              <div className="invoice-header">
                <span className="invoice-id">Invoice #{invoice.id}</span>
                <span className={`status-badge ${getStatusClass(invoice.status)}`}>{invoice.status}</span>
              </div>
              <div className="invoice-details">
                <p><strong>Created:</strong> {invoice.createdAt}</p>
                <p><strong>Due:</strong> {invoice.dueDate}</p>
                <p><strong>Total:</strong> ${calculateTotal(invoice.items).toFixed(2)}</p>
                <p><strong>Notes:</strong> {invoice.notes || 'N/A'}</p>
                <div className="items-list">
                  <strong>Items:</strong>
                  <ul>
                    {invoice.items.map((item, idx) => (
                      <li key={idx}>{item.description} - ${item.rate.toFixed(2)} × {item.hours} = ${(item.rate * item.hours).toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
                <label className="status-select">
                  Status:
                  <select value={invoice.status} onChange={handleStatusChange(invoice.id)}>
                    <option value="outstanding">Outstanding</option>
                    <option value="paid">Paid</option>
                    <option value="late">Late</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;