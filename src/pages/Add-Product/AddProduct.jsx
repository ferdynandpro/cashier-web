import React, { useState } from 'react';
import '../../assest/styles/components/add-product.css';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('Penggaris');
  const [imageURL, setImageURL] = useState('');
  const [showAlert, setShowAlert] = useState(false); // State untuk menampilkan alert

  const handlePriceChange = (event, setter) => {
    const inputPrice = event.target.value;
    if (!isNaN(inputPrice) || inputPrice === '') {
      setter(inputPrice);
    }
  };

  const handlePurchasePriceChange = (event) => handlePriceChange(event, setPurchasePrice);
  const handleSellingPriceChange = (event) => handlePriceChange(event, setSellingPrice);
  const handleStockChange = (event) => handlePriceChange(event, setProductStock);

  const productCategories = [
    "Penggaris", "Buku", "Kertas", "Lem", "Lakban", "Alat Tulis",
    "Undangan", "Map", "Parfum", "Elektronik", "Print"
  ];

  const handleChangeSelectedValue = (event) => {
    setSelectedProductCategory(event.target.value);
  };

  const handleProductSubmit = (event) => {
    event.preventDefault();
    const productObj = {
      productName,
      productDescription,
      purchasePrice,
      sellingPrice,
      productStock,
      category: selectedProductCategory,
      imageURL,
      updatedAt: new Date().toISOString()
    };

    fetch("https://back-end-cashier.vercel.app/upload-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productObj)
    })
    .then(res => res.json())
    .then(data => {
      setShowAlert(true); // Menampilkan alert ketika upload berhasil
      setProductName('');
      setProductDescription('');
      setPurchasePrice('');
      setSellingPrice('');
      setProductStock('');
      setSelectedProductCategory('Penggaris');
      setImageURL('');
    })
    .catch(error => {
      console.error("Error uploading product:", error);
      alert("Error uploading product. Please try again.");
    });
  };

  const handleOkButtonClick = () => {
    setShowAlert(false); // Menyembunyikan alert ketika tombol "OK" diklik
  };

  return (
    <div className='add--product-container'>
      <p className='titles'>Add New Product</p>

      <div className="form-container">
        <form onSubmit={handleProductSubmit}>
          <div className="form-group">
            <label htmlFor="productName">Product Name :</label>
            <input
              type="text"
              id="productName"
              name="productName"
              required
              placeholder='Product Name'
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">Description :</label>
            <input
              type="text"
              id="productDescription"
              name="productDescription"
              required
              placeholder='Description of product'
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="purchasePrice">Purchase Price :</label>
            <input
              type="text"
              id="purchasePrice"
              name="purchasePrice"
              required
              placeholder='Purchase Price of product'
              value={purchasePrice}
              onChange={handlePurchasePriceChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sellingPrice">Selling Price :</label>
            <input
              type="text"
              id="sellingPrice"
              name="sellingPrice"
              required
              placeholder='Selling Price of product'
              value={sellingPrice}
              onChange={handleSellingPriceChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="productStock">Stock :</label>
            <input
              type="text"
              id="productStock"
              name="productStock"
              required
              placeholder='Stock of product'
              value={productStock}
              onChange={handleStockChange}
            />
          </div>

          <div className="category--image-con">
            <div className="form-group row">
              <label className='wewwws' htmlFor="inputState">Category:</label>
              <select
                className='menu--option'
                name="categoryName"
                id="inputState"
                value={selectedProductCategory}
                onChange={handleChangeSelectedValue}
              >
                {productCategories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group row">
              <label className='wewwws' htmlFor="imageURL">Images:</label>
              <input
              className='image--links'
                type="text"
                id="imageURL"
                name="imageURL"
                required
                placeholder='Product Image URL'
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
            </div>
          </div>

          {showAlert && (
            <div className="upload-success-alert">
              <p className='add--alert'>Product upload succeeded</p>
              <button className='add--btn--alert' onClick={handleOkButtonClick}>OK</button>
            </div>
          )}

          <button className='submit--btn' type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
