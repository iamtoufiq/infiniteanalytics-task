import React from "react";

const InputField = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  min,
  step,
  error,
}) => (
  <div className="input-group">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      min={min}
      step={step}
    />
    {error && <span className="error">{error}</span>}
  </div>
);

export default InputField;
