import React, { useState } from "react";
import InputField from "./InputField";

const LineItemForm = ({ addItem }) => {
  const [item, setItem] = useState({
    description: "",
    type: "labor",
    rate: 0,
    quantity: 0,
  });
  const [errors, setErrors] = useState({
    description: "",
    rate: "",
    quantity: "",
  });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]:
        name === "description" || name === "type"
          ? value
          : parseFloat(value) || 0,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateItem = () => {
    const newErrors = {};
    if (!item.description) newErrors.description = "Description is required";
    if (item.rate <= 0) newErrors.rate = "Rate must be greater than 0";
    if (item.quantity <= 0)
      newErrors.quantity = `${getQuantityLabel(
        item.type
      )} must be greater than 0`;
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateItem()) return;
    addItem({ ...item });
    setItem({ description: "", type: "labor", rate: 0, quantity: 0 });
  };

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
    <div className="item-input">
      <InputField
        name="description"
        placeholder="Description"
        value={item.description}
        onChange={handleItemChange}
        error={errors.description}
      />
      <select name="type" value={item.type} onChange={handleItemChange}>
        <option value="labor">Labor</option>
        <option value="expense">Expense</option>
        <option value="material">Material</option>
      </select>
      <InputField
        type="number"
        name="rate"
        placeholder="Rate ($)"
        value={item.rate || ""}
        onChange={handleItemChange}
        min="0"
        step="0.01"
        error={errors.rate}
      />
      <InputField
        type="number"
        name="quantity"
        placeholder={getQuantityLabel(item.type)}
        value={item.quantity || ""}
        onChange={handleItemChange}
        min="0"
        step={item.type === "labor" ? "0.1" : "1"}
        error={errors.quantity}
      />
      <button type="button" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
};

export default LineItemForm;
