import React, { useState } from 'react';
import '../../assest/styles/components/payment.css';
import ConfirmPayment from '../Alert/ConfirmPayment';

const Payment = ({ selectedProducts, onUpdateQuantity, onPayment }) => {
  const [amountPaid, setAmountPaid] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAmountError, setShowAmountError] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State to show success alert

  const totalPrice = selectedProducts.reduce((acc, product) => {
    return acc + (product.sellingPrice ? product.sellingPrice * product.quantity : 0);
  }, 0);

  const change = amountPaid - totalPrice;

  const handleAmountPaidChange = (e) => {
    setAmountPaid(Number(e.target.value));
  };

  const handlePayment = async () => {
    if (change < 0) {
      setShowAmountError(true); // Show amount error message
      return;
    }

    try {
      const paymentProofData = {
        tanggal_pembayaran: new Date().toISOString()
      };

      const paymentProofResponse = await fetch('http://localhost:5000/bukti-pembayaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentProofData)
      });

      if (!paymentProofResponse.ok) {
        throw new Error('Failed to save payment proof');
      }

      const paymentProofResult = await paymentProofResponse.json();
      const buktiId = paymentProofResult.result.insertedId;

      for (const product of selectedProducts) {
        const detail = {
          productName: product.productName,
          productQuantity: product.quantity,
          sellingPrice: product.sellingPrice,
          totalPrice: product.sellingPrice * product.quantity
        };

        const detailResponse = await fetch(`https://back-end-cashier.vercel.app/bukti-pembayaran/${buktiId}/detail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ detail })
        });

        if (!detailResponse.ok) {
          throw new Error('Failed to save payment detail');
        }
      }

      for (const product of selectedProducts) {
        const response = await fetch(`https://back-end-cashier.vercel.app/product/${product._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productStock: product.productStock - product.quantity })
        });
        if (!response.ok) {
          throw new Error(`Failed to update stock for product ${product._id}`);
        }
      }

      onPayment();
      setShowAlert(true); // Show success alert
    } catch (error) {
      console.error('Error updating product stock or saving log:', error);
      alert('Failed to update product stock or save log.');
    }
  };

  const handleConfirmPayment = () => {
    setShowConfirmModal(true);
    setShowAmountError(false); // Reset amount error message when confirming payment
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    handlePayment();
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setShowAmountError(false); // Reset amount error message when cancelling
  };

  const handleOkButtonClick = () => {
    setShowAlert(false); // Hide success alert
    window.location.reload(); // Refresh the page
  };

  const handleRemoveProduct = (productName) => {
    onUpdateQuantity(productName, -selectedProducts.find(p => p.productName === productName).quantity);
  };

  return (
    <div className='payment'>
      <p className='titles'>Payment Details</p>
      <div className="payment--container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>
                    <div className='quantity-controls'>
                      <button
                        className={`indec--btn ${product.quantity <= 1 ? 'disabled' : ''}`}
                        onClick={() => onUpdateQuantity(product.productName, -1)}
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span className='quantity'>{product.quantity}</span>
                      <button
                        className={`indec--btn ${product.quantity >= product.productStock ? 'disabled' : ''}`}
                        onClick={() => onUpdateQuantity(product.productName, 1)}
                        disabled={product.quantity >= product.productStock}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>Rp. {product.sellingPrice ? product.sellingPrice.toLocaleString('id-ID') : '0'}</td>
                  <td>Rp. {(product.sellingPrice ? product.sellingPrice * product.quantity : 0).toLocaleString('id-ID')}</td>
                  <td>
                    <button className="delete--btn" onClick={() => handleRemoveProduct(product.productName)}>Remove</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No products added yet</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className='total-price'>
          <h3>Total Price: Rp. {totalPrice.toLocaleString('id-ID')}</h3>
        </div>
        <div className='amount-paid'>
          <label htmlFor='amountPaid'>Amount Paid: </label>
          <input 
            type='number' 
            id='amountPaid' 
            value={amountPaid} 
            onChange={handleAmountPaidChange} 
          />
          {showAmountError && <p style={{ color: 'red' }}>Input the correct amount paid</p>}
        </div>
        <div className='change'>
          <h3>Change: Rp. {change >= 0 ? change.toLocaleString('id-ID') : '0'}</h3>
        </div>
        <div className="bayar--btn">
          {selectedProducts.length > 0 ? (
            <button className='byr--btn' onClick={handleConfirmPayment}>Confirm</button>
          ) : (
            <p style={{ color: 'red' }}>No products selected</p>
          )}
        </div>
      </div>
      {showConfirmModal && <ConfirmPayment onConfirm={handleConfirm} onCancel={handleCancel} />}
      {showAlert && (
        <div className="upload-success-alert">
          <p className='add--alert'>Payment successful. Stock updated and log saved.</p>
          <button className='add--btn--alert' onClick={handleOkButtonClick}>OK</button>
        </div>
      )}
    </div>
  );
};

export default Payment;
