import React, { useState, useEffect } from 'react';
import invoiceStore from '../stores/InvoiceStore';
import { InvoiceActions } from '../actions/InvoiceActions';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState(invoiceStore.getAllInvoices());
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const updateInvoices = () => {
      let newInvoices;
      switch (filter) {
        case 'paid': newInvoices = invoiceStore.getPaidInvoices(); break;
        case 'outstanding': newInvoices = invoiceStore.getOutstandingInvoices(); break;
        case 'late': newInvoices = invoiceStore.getLateInvoices(); break;
        case 'date': newInvoices = invoiceStore.getInvoicesByDateRange(startDate, endDate); break;
        case 'all':
        default: newInvoices = invoiceStore.getAllInvoices(); break;
      }
      setInvoices(newInvoices);
    };
    invoiceStore.on('change', updateInvoices);
    updateInvoices();
    return () => invoiceStore.off('change', updateInvoices);
  }, [filter, startDate, endDate]);

  const handleStatusChange = (id) => (e) => {
    InvoiceActions.updateInvoiceStatus(id, e.target.value);
  };

  const calculateTotal = (items) => items.reduce((sum, item) => sum + (item.rate * (item.quantity || item.hours)), 0);

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
      <div className="filter-controls">
        <label className="filter-label">
          Filter:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="outstanding">Outstanding</option>
            <option value="late">Late</option>
            <option value="date">By Date Range</option>
          </select>
        </label>
        {filter === 'date' && (
          <div className="date-range">
            <label>
              Start Date:
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              End Date:
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>
        )}
      </div>
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
                      <li key={idx}>
                        {item.description} ({item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'N/A'}) - 
                        ${item.rate.toFixed(2)} × {(item.quantity || item.hours)} = ${(item.rate * (item.quantity || item.hours)).toFixed(2)}
                      </li>
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