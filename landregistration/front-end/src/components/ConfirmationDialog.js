import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConfirmationDialog = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel"
}) => {
  if (!show) return null;
  
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              {cancelButtonText}
            </button>
            <button type="button" className="btn btn-primary" onClick={onConfirm}>
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;