import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";

const Modal = ({ onClose, children }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <RiCloseCircleFill size={24} color="red" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;