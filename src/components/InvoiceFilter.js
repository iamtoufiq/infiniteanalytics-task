import React from "react";
import toast from "react-hot-toast";

const InvoiceFilter = ({
  filter,
  setFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (startDate && newEndDate && new Date(newEndDate) < new Date(startDate)) {
      toast.error("End Date cannot be earlier than Start Date");
      setEndDate(startDate);
    } else {
      setEndDate(newEndDate);
    }
  };

  return (
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
      {filter === "date" && (
        <div className="date-range">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-picker"
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="date-picker"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilter;
