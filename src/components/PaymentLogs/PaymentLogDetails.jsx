import React, { useEffect, useState } from 'react';
import '../../assest/styles/components/Payment-logs-details.css'
const PaymentLogDetails = ({ paymentId }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/bukti-pembayaran/${paymentId}/detail`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }
        const data = await response.json();
        setPaymentDetails(data);
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  return (
    <div className="payment-log-details">
      <p className='payment--id'>Payment ID: {paymentId}</p>
      {paymentDetails && paymentDetails.length > 0 ? (
        <ul className='wrapper--data'>
          {paymentDetails.map((detail, index) => (
            <li key={index}>
              <p className='pn--data'>Product Name: {detail.productName}</p>
              <p className='pn--data'>Quantity: {detail.productQuantity}</p>
              <p  className='pn--data'>Total Price: Rp. {detail.totalPrice.toLocaleString('id-ID')}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No payment details found</p>
      )}
    </div>
  );
};

export default PaymentLogDetails;
