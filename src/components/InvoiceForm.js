import React, { useState } from 'react';
import { InvoiceActions } from '../actions/InvoiceActions';

const InvoiceForm = () => {
  const [invoice, setInvoice] = useState({ items: [], notes: '', dueDate: '' });
  const [item, setItem] = useState({ description: '', rate: 0, hours: 0 });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: name === 'description' ? value : parseFloat(value) || 0 }));
  };

  const addItem = () => {
    if (!item.description) { alert('Please enter a description'); return; }
    setInvoice(prev => ({ ...prev, items: [...prev.items, { ...item }] }));
    setItem({ description: '', rate: 0, hours: 0 });
  };

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (invoice.items.length === 0) { alert('Please add at least one line item'); return; }
    InvoiceActions.createInvoice(invoice);
    setInvoice({ items: [], notes: '', dueDate: '' });
    alert('Invoice "sent" successfully (mocked)');
  };

  const calculateItemTotal = (item) => item.rate * item.hours;
  const calculateInvoiceTotal = () => invoice.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  return (
    <div className="invoice-form">
      <h2>Create New Invoice</h2>
      <div className="line-items">
        <h3>Line Items</h3>
        <div className="item-input">
          <input type="text" name="description" placeholder="Description (e.g., Web Design)" value={item.description} onChange={handleItemChange} />
          <input type="number" name="rate" placeholder="Rate ($)" value={item.rate || ''} onChange={handleItemChange} min="0" step="0.01" />
          <input type="number" name="hours" placeholder="Hours/Qty" value={item.hours || ''} onChange={handleItemChange} min="0" step="0.1" />
          <button type="button" onClick={addItem}>Add</button>
        </div>
        {invoice.items.length > 0 && (
          <div className="items-table">
            <div className="items-header">
              <span>Description</span>
              <span>Rate</span>
              <span>Hours/Qty</span>
              <span>Total</span>
            </div>
            {invoice.items.map((item, index) => (
              <div key={index} className="item-row">
                <span>{item.description}</span>
                <span>${item.rate.toFixed(2)}</span>
                <span>{item.hours}</span>
                <span>${calculateItemTotal(item).toFixed(2)}</span>
              </div>
            ))}
            <div className="items-footer">
              <span>Total:</span>
              <span></span>
              <span></span>
              <span>${calculateInvoiceTotal().toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input type="date" name="dueDate" value={invoice.dueDate} onChange={handleInvoiceChange} />
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea name="notes" value={invoice.notes} onChange={handleInvoiceChange} placeholder="e.g., Send check to 123 Infinite St." />
      </div>
      <button className="submit-btn" onClick={handleSubmit}>Create & Send Invoice</button>
    </div>
  );
};

export default InvoiceForm;