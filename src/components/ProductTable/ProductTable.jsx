import React from 'react';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { GoInfo } from "react-icons/go";
import '../../assest/styles/components/manage-product.css';

const ProductTable = ({ products, formatPrice, confirmDelete }) => {
  // Function to determine the color based on stock quantity
  const getStockColor = (stock) => {
    if (stock > 50) {
      return 'green';
    } else if (stock < 50 && stock >= 10) {
      return 'yellow';
    } else if (stock < 10) {
      return 'red';
    }
  };

  return (
    <div>
      <table id="customers">
        <thead>
          <tr>
            <th>No</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Purchase Price</th>
            <th>Selling Price</th>
            <th>Stock
              <div className="tooltip">
                <GoInfo className="info-icon" />
                <span className="tooltiptext">Green: stock is ready <br />Yellow: under 50 <br />Red: under 10</span>
              </div>
            </th>
            <th>Last Update</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>{product.productName}</td>
              <td className='prod--category'>{product.category}</td>
              <td className='prod--desc'>{product.productDescription}</td>
              <td>{formatPrice(product.purchasePrice)}</td>
              <td>{formatPrice(product.sellingPrice)}</td>
              <td style={{ color: getStockColor(product.productStock) }}>{product.productStock}</td>
              <td>{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}</td>
              <td className='prod--btn'>
                <a href={`/admin/dashboard/edit-product/${product._id}`}><CiEdit className='edit--btn' /></a>
                <button onClick={() => confirmDelete(product._id)}><MdDeleteOutline className='delete--btn' /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
