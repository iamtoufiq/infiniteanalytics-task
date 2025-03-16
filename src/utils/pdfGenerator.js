import jsPDF from "jspdf";

export const generatePDF = (invoice) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(43, 108, 176);
  doc.text(`Invoice #${invoice.id}`, 20, 20);
  doc.setFontSize(12);
  doc.setTextColor(45, 55, 72);
  doc.text(`Created: ${invoice.createdAt}`, 20, 35);
  doc.text(`Due: ${invoice.dueDate}`, 20, 45);
  doc.text(`Status: ${invoice.status}`, 20, 55);
  doc.text(
    `Total: $${invoice.items
      .reduce((sum, item) => sum + item.rate * item.quantity, 0)
      .toFixed(2)}`,
    20,
    65
  );
  doc.text(`Notes: ${invoice.notes || "N/A"}`, 20, 75);
  doc.setFontSize(14);
  doc.setTextColor(74, 85, 104);
  doc.text("Line Items", 20, 95);
  doc.setFontSize(10);
  doc.setTextColor(45, 55, 72);
  doc.text("Description", 20, 105);
  doc.text("Type", 70, 105);
  doc.text("Rate", 100, 105);
  doc.text("Qty", 130, 105);
  doc.text("Total", 160, 105);
  let yPos = 115;
  invoice.items.forEach((item) => {
    doc.text(item.description, 20, yPos);
    doc.text(
      item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "N/A",
      70,
      yPos
    );
    doc.text(`$${item.rate.toFixed(2)}`, 100, yPos);
    doc.text(`${item.quantity}`, 130, yPos);
    doc.text(`$${(item.rate * item.quantity).toFixed(2)}`, 160, yPos);
    yPos += 10;
  });
  doc.setFontSize(12);
  doc.setTextColor(45, 55, 72);
  doc.text(
    `Grand Total: $${invoice.items
      .reduce((sum, item) => sum + item.rate * item.quantity, 0)
      .toFixed(2)}`,
    160,
    yPos + 10
  );
  doc.save(`invoice_${invoice.id}.pdf`);
};