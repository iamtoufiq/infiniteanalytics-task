import React from "react";
import { InvoiceActions } from "../actions/InvoiceActions";
import { generatePDF } from "../utils/pdfGenerator";
import StatusBadge from "./StatusBadge";
import { RiChatDownloadFill, RiMailFill } from "react-icons/ri";

const InvoiceCard = ({ invoice }) => {
  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.rate * item.quantity, 0);

  const handleStatusChange = (e) => {
    InvoiceActions.updateInvoiceStatus(invoice.id, e.target.value);
  };

  const handleDownload = () => generatePDF(invoice);
  const handleSendEmail = () => {
    console.log(`Sending email for Invoice #${invoice.id}`);
    alert(`Email sent for Invoice #${invoice.id} (mocked)`);
  };

  return (
    <div className="invoice-card">
      <div className="invoice-header">
        <span className="invoice-id">Invoice #{invoice.id}</span>
        <StatusBadge status={invoice.status} />
      </div>
      <div className="invoice-body">
        <div className="invoice-details">
          <p>
            <strong>Created:</strong> {invoice.createdAt}
          </p>
          <p>
            <strong>Due:</strong> {invoice.dueDate}
          </p>
          <p>
            <strong>Total:</strong> ${calculateTotal(invoice.items).toFixed(2)}
          </p>
          <p>
            <strong>Notes:</strong> {invoice.notes || "N/A"}
          </p>
        </div>
        <div className="items-list">
          <strong>Items:</strong>
          <ul>
            {invoice.items.map((item, idx) => (
              <li key={idx}>
                {item.description} (
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}) - $
                {item.rate.toFixed(2)} × {item.quantity} = $
                {(item.rate * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="invoice-footer">
        <label className="status-select">
          Status:
          <select value={invoice.status} onChange={handleStatusChange}>
            <option value="outstanding">Outstanding</option>
            <option value="paid">Paid</option>
            <option value="late">Late</option>
          </select>
        </label>
        <div className="invoice-actions">
          <button
            className="download-btn"
            onClick={handleDownload}
            title="Download PDF"
          >
            <RiChatDownloadFill size={24} />
          </button>
          <button
            className="email-btn"
            onClick={handleSendEmail}
            title="Send Email"
          >
            <RiMailFill size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
