import React, { useEffect, useState } from 'react';
import '../../assest/styles/components/category-count.css'
const CategoryCount = ({ count }) => {
    return (
        <div className="count--product">
        <p className='title--count'>Category Used:</p>
        <p className='counts'>{count}</p>
        </div>
    );
  };

export default CategoryCount;
