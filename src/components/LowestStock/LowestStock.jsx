import React, { useEffect, useState } from 'react';
import '../../assest/styles/components/lowest-stock.css'
const LowestStock = () => {
  const [lowestStockProducts, setLowestStockProducts] = useState([]); // State to hold products with lowest stock

  useEffect(() => {
    fetchLowestStockProducts();
  }, []);

  const fetchLowestStockProducts = () => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => {
        // Sort products by stock in ascending order
        const sortedProducts = data.sort((a, b) => a.productStock - b.productStock);
        // Get the first 5 products (lowest stock)
        const lowestStock = sortedProducts.slice(0, 5);
        setLowestStockProducts(lowestStock);
      })
      .catch(error => console.error("Error fetching data:", error));
  };

  return (
    <div className="lowest-stock-products-container">
      <p className='titles'>Products with Lowest Stock</p>
      <table className="lowest-stock-products-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Product Name</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {lowestStockProducts.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.productName}</td>
              <td>{product.productStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowestStock;
