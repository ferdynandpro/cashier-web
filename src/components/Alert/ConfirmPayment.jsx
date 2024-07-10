import React from 'react';
import '../../assest/styles/components/confirm-payment.css';

const ConfirmPayment = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirm-payment-modal">
      <div className="confirm-payment-content">
        <h2>Confirm Payment</h2>
        <p>Are you sure you want to continue with this payment?</p>
        <div className="confirm-payment-buttons">
          <button className="confirm-btn" onClick={onConfirm}>Yes</button>
          <button className="cancel-btn" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
