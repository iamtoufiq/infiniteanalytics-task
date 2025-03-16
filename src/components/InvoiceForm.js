import React, { useState } from "react";
import { InvoiceActions } from "../actions/InvoiceActions";
import LineItemForm from "./LineItemForm";
import LineItemsTable from "./LineItemsTable";

const InvoiceForm = ({ closeModal }) => {
  const [invoice, setInvoice] = useState({ items: [], notes: "", dueDate: "" });
  const [errors, setErrors] = useState({ items: "", dueDate: "" });

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addItem = (newItem) => {
    setInvoice((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (invoice.items.length === 0)
      newErrors.items = "At least one line item is required";
    if (!invoice.dueDate) newErrors.dueDate = "Due Date is required";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    InvoiceActions.createInvoice(invoice);
    setInvoice({ items: [], notes: "", dueDate: "" });
    alert('Invoice "sent" successfully (mocked)');
    closeModal();
  };

  return (
    <div className="invoice-form">
      <h2 className="invoice-form-header">Create New Invoice</h2>
      <div className="line-items">
        <h3>Line Items</h3>
        <LineItemForm addItem={addItem} />
        {invoice.items.length > 0 && <LineItemsTable items={invoice.items} />}
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
      <button className="submit-btn" onClick={handleSubmit}>
        Create & Send Invoice
      </button>
    </div>
  );
};

export default InvoiceForm;
