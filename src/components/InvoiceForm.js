import React, { useState } from 'react';
import { InvoiceActions } from '../actions/InvoiceActions';
// import "../styles/modal.css";

const InvoiceForm = ({ closeModal }) => {
  const [invoice, setInvoice] = useState({ items: [], notes: '', dueDate: '' });
  const [item, setItem] = useState({ description: '', type: 'labor', rate: 0, quantity: 0 });
  const [errors, setErrors] = useState({ description: '', rate: '', quantity: '', dueDate: '' });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: name === 'description' || name === 'type' ? value : parseFloat(value) || 0 }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validateItem = () => {
    const newErrors = {};
    if (!item.description) newErrors.description = 'Description is required';
    if (item.rate <= 0) newErrors.rate = 'Rate must be greater than 0';
    if (item.quantity <= 0) newErrors.quantity = `${getQuantityLabel(item.type)} must be greater than 0`;
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    if (!validateItem()) return;
    setInvoice(prev => ({ ...prev, items: [...prev.items, { ...item }] }));
    setItem({ description: '', type: 'labor', rate: 0, quantity: 0 });
  };

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    if (invoice.items.length === 0) newErrors.items = 'At least one line item is required';
    if (!invoice.dueDate) newErrors.dueDate = 'Due Date is required';
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
      <h2 className="invoice-form-header">Create New Invoice</h2>
      <div className="line-items">
        <h3>Line Items</h3>
        <div className="item-input">
          <div className="input-group">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={handleItemChange}
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>
          <select name="type" value={item.type} onChange={handleItemChange}>
            <option value="labor">Labor</option>
            <option value="expense">Expense</option>
            <option value="material">Material</option>
          </select>
          <div className="input-group">
            <input
              type="number"
              name="rate"
              placeholder="Rate ($)"
              value={item.rate || ''}
              onChange={handleItemChange}
              min="0"
              step="0.01"
            />
            {errors.rate && <span className="error">{errors.rate}</span>}
          </div>
          <div className="input-group">
            <input
              type="number"
              name="quantity"
              placeholder={getQuantityLabel(item.type)}
              value={item.quantity || ''}
              onChange={handleItemChange}
              min="0"
              step={item.type === 'labor' ? '0.1' : '1'}
            />
            {errors.quantity && <span className="error">{errors.quantity}</span>}
          </div>
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
        {errors.items && <span className="error">{errors.items}</span>}
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={invoice.dueDate}
          onChange={handleInvoiceChange}
          className="date-picker"
        />
        {errors.dueDate && <span className="error">{errors.dueDate}</span>}
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={invoice.notes}
          onChange={handleInvoiceChange}
          placeholder="e.g., Pay via bank transfer or send check to 123 Infinite St."
        />
      </div>
      <button className="submit-btn" onClick={handleSubmit}>Create & Send Invoice</button>
    </div>
  );
};

export default InvoiceForm;