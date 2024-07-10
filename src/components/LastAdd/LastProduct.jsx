import React, { useEffect, useState } from 'react';
import '../../assest/styles/components/last-product.css';

const LastProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => {
        const sortedProducts = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setAllProducts(sortedProducts.slice(0, 5));
      })
      .catch(error => console.error("Error fetching data:", error));
  };

  return (
    <div className='lastproduct--container'>
      <p className='titles'>Last 5 Updated Products</p>
      <table id="last-5-products">
        <thead>
          <tr>
            <th>No</th>
            <th>ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((product, index) => (
            <tr key={product._id}>
              <td className='index--product'>{index + 1}</td>
              <td className="id--product">{product._id}</td>
              <td className='prod--name'>{product.productName}</td>
              <td className='prod--category'>{product.category}</td>
              <td className="last--updated">{new Date(product.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LastProduct;
