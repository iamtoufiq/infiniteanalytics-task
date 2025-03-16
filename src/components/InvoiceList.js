import React, { useState, useEffect } from "react";
import invoiceStore from "../stores/InvoiceStore";
import InvoiceFilter from "./InvoiceFilter";
import InvoiceCard from "./InvoiceCard";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState(invoiceStore.getAllInvoices());
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const updateInvoices = () => {
      let newInvoices;
      switch (filter) {
        case "paid":
          newInvoices = invoiceStore.getPaidInvoices();
          break;
        case "outstanding":
          newInvoices = invoiceStore.getOutstandingInvoices();
          break;
        case "late":
          newInvoices = invoiceStore.getLateInvoices();
          break;
        case "date":
          newInvoices = invoiceStore.getInvoicesByDateRange(startDate, endDate);
          break;
        case "all":
        default:
          newInvoices = invoiceStore.getAllInvoices();
          break;
      }
      setInvoices(newInvoices);
    };
    invoiceStore.on("change", updateInvoices);
    updateInvoices();
    return () => invoiceStore.off("change", updateInvoices);
  }, [filter, startDate, endDate]);

  return (
    <div className="invoice-list">
      <h2>Invoices</h2>
      <InvoiceFilter
        filter={filter}
        setFilter={setFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      {invoices.length === 0 ? (
        <p className="no-invoices">No invoices to display</p>
      ) : (
        <div className="invoices-container">
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
