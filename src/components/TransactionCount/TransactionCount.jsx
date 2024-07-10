import React from 'react';
// import "../../assest/styles/components/transaction-count.css";

const TransactionCount = ({ count }) => {
  return (
    <div className="count--product">
      <p className='title--count'>Total Transactions:</p>
      <p className='counts'>{count}</p>
    </div>
  );
};

export default TransactionCount;
