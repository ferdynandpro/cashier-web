import React, { useState, useEffect } from 'react';
// import './ProductPricesTable.css';

const ProductPricesTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://back-end-cashier.vercel.app/products");
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  return (
    <div className="product-prices-table">
      <h2>Product Prices</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Product Name</th>
            <th>Purchase Price</th>
            <th>Selling Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>{product.productName}</td>
              <td>{formatPrice(product.purchasePrice)}</td>
              <td>{formatPrice(product.sellingPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPricesTable;
