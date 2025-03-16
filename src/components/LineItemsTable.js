import React from "react";

const LineItemsTable = ({ items }) => {
  const calculateItemTotal = (item) => item.rate * item.quantity;
  const calculateInvoiceTotal = () =>
    items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const getQuantityLabel = (type) => {
    switch (type) {
      case "labor":
        return "Hours";
      case "material":
        return "Quantity";
      case "expense":
        return "Units";
      default:
        return "Quantity";
    }
  };

  return (
    <div className="items-table">
      <div className="items-header">
        <span>Description</span>
        <span>Type</span>
        <span>Rate</span>
        <span>{getQuantityLabel(items[0]?.type)}</span>
        <span>Total</span>
      </div>
      {items.map((item, index) => (
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
  );
};

export default LineItemsTable;
