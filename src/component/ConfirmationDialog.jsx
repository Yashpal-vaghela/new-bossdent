import React from "react";

export const ConfirmationDialog = ({ onConfirm, onCancel, title,selectProductModal }) => {
  return (
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <h3 className="mb-0">
          Are you sure you want to remove
          &nbsp;<span className="fw-bold" style={{ color: "#c89c31" }}>
            {/* {title} */}
            {selectProductModal?.product_name}
          </span> ?
        </h3>
        <div className="confirmation-dialog-actions">
          <button className="btn-remove" onClick={onConfirm}>
            Remove
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};