import React, { useState, useEffect } from 'react';
import invoiceStore from '../stores/InvoiceStore';
import { InvoiceActions } from '../actions/InvoiceActions';
import jsPDF from 'jspdf'; // Import jsPDF
import { RiChatDownloadFill, RiMailFill  } from "react-icons/ri";

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

  const handleDownload = (id) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(43, 108, 176); // Blue from the app's color scheme
    doc.text(`Invoice #${invoice.id}`, 20, 20);

    // Details
    doc.setFontSize(12);
    doc.setTextColor(45, 55, 72); // Dark gray from the app
    doc.text(`Created: ${invoice.createdAt}`, 20, 35);
    doc.text(`Due: ${invoice.dueDate}`, 20, 45);
    doc.text(`Status: ${invoice.status}`, 20, 55);
    doc.text(`Total: $${calculateTotal(invoice.items).toFixed(2)}`, 20, 65);
    doc.text(`Notes: ${invoice.notes || 'N/A'}`, 20, 75);

    // Line Items Header
    doc.setFontSize(14);
    doc.setTextColor(74, 85, 104); // Medium gray
    doc.text('Line Items', 20, 95);

    // Table Headers
    doc.setFontSize(10);
    doc.setTextColor(45, 55, 72);
    doc.text('Description', 20, 105);
    doc.text('Type', 70, 105);
    doc.text('Rate', 100, 105);
    doc.text('Qty', 130, 105);
    doc.text('Total', 160, 105);

    // Line Items
    let yPos = 115;
    invoice.items.forEach((item) => {
      doc.text(item.description, 20, yPos);
      doc.text(item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'N/A', 70, yPos);
      doc.text(`$${item.rate.toFixed(2)}`, 100, yPos);
      doc.text(`${item.quantity || item.hours}`, 130, yPos);
      doc.text(`$${(item.rate * (item.quantity || item.hours)).toFixed(2)}`, 160, yPos);
      yPos += 10;
    });

    // Footer Total
    doc.setFontSize(12);
    doc.setTextColor(45, 55, 72);
    doc.text(`Grand Total: $${calculateTotal(invoice.items).toFixed(2)}`, 160, yPos + 10);

    // Save the PDF
    doc.save(`invoice_${invoice.id}.pdf`);
  };

  const handleSendEmail = (id) => {
    console.log(`Sending email for Invoice #${id}`); // For toast integration
    alert(`Email sent for Invoice #${id} (mocked)`);
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
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-picker" />
            </label>
            <label>
              End Date:
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-picker" />
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
                <div className="invoice-actions">
                  <label className="status-select">
                    Status:
                    <select value={invoice.status} onChange={handleStatusChange(invoice.id)}>
                      <option value="outstanding">Outstanding</option>
                      <option value="paid">Paid</option>
                      <option value="late">Late</option>
                    </select>
                  </label>
                  <button className="download-btn" onClick={() => handleDownload(invoice.id)} title="Download PDF">
                  <RiChatDownloadFill size={24}/>
                  </button>
                  <button className="email-btn" onClick={() => handleSendEmail(invoice.id)} title="Send Email">
                 <RiMailFill size={24}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;