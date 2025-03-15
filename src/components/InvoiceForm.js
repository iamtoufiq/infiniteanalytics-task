import React, { useState } from 'react';
import { InvoiceActions } from '../actions/InvoiceActions';

const InvoiceForm = ({ closeModal }) => {
  const [invoice, setInvoice] = useState({ items: [], notes: '', dueDate: '' });
  const [item, setItem] = useState({ description: '', type: 'labor', rate: 0, quantity: 0 });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: name === 'description' || name === 'type' ? value : parseFloat(value) || 0 }));
  };

  const addItem = () => {
    if (!item.description) { alert('Please enter a description'); return; }
    setInvoice(prev => ({ ...prev, items: [...prev.items, { ...item }] }));
    setItem({ description: '', type: 'labor', rate: 0, quantity: 0 });
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
    closeModal();
  };

  const calculateItemTotal = (item) => item.rate * item.quantity;
  const calculateInvoiceTotal = () => invoice.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const getQuantityLabel = (type) => {
    switch (type) {
      case 'labor': return 'Hours';
      case 'material': return 'Quantity';
      case 'expense': return 'Units';
      default: return 'Quantity';
    }
  };

  return (
    <div className="invoice-form">
      <h2>Create New Invoice</h2>
      <div className="line-items">
        <h3>Line Items</h3>
        <div className="item-input">
          <input type="text" name="description" placeholder="Description" value={item.description} onChange={handleItemChange} />
          <select name="type" value={item.type} onChange={handleItemChange}>
            <option value="labor">Labor</option>
            <option value="expense">Expense</option>
            <option value="material">Material</option>
          </select>
          <input type="number" name="rate" placeholder="Rate ($)" value={item.rate || ''} onChange={handleItemChange} min="0" step="0.01" />
          <input type="number" name="quantity" placeholder={getQuantityLabel(item.type)} value={item.quantity || ''} onChange={handleItemChange} min="0" step={item.type === 'labor' ? '0.1' : '1'} />
          <button type="button" onClick={addItem}>Add</button>
        </div>
        {invoice.items.length > 0 && (
          <div className="items-table">
            <div className="items-header">
              <span>Description</span>
              <span>Type</span>
              <span>Rate</span>
              <span>{getQuantityLabel(item.type)}</span>
              <span>Total</span>
            </div>
            {invoice.items.map((item, index) => (
              <div key={index} className="item-row">
                <span>{item.description}</span>
                <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                <span>${item.rate.toFixed(2)}</span>
                <span>{item.quantity}</span>
                <span>${calculateItemTotal(item).toFixed(2)}</span>
              </div>
            ))}
            <div className="items-footer">
              <span>Total:</span>
              <span></span>
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
        <textarea name="notes" value={invoice.notes} onChange={handleInvoiceChange} placeholder="e.g., Pay via bank transfer or send check to 123 Infinite St." />
      </div>
      <button className="submit-btn" onClick={handleSubmit}>Create & Send Invoice</button>
    </div>
  );
};

export default InvoiceForm;