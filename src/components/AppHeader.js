import React from "react";
import { RiAddCircleFill } from "react-icons/ri";

const AppHeader = ({ onCreateInvoice }) => (
  <header className="app-header">
    <h1>Invoicing App</h1>
    <button className="create-invoice-btn" onClick={onCreateInvoice}>
      <RiAddCircleFill size={20} style={{ marginRight: "5px" }} />
      Create Invoice
    </button>
  </header>
);

export default AppHeader;
