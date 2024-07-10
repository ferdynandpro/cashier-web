// ProductCount.js
import React from 'react';
import "../../assest/styles/components/product-count.css"

const ProductCount = ({ count }) => {
  return (
      <div className="count--product">
      <p className='title--count'>Total Products:</p>
      <p className='counts'>{count}</p>
      </div>
  );
};

export default ProductCount;
