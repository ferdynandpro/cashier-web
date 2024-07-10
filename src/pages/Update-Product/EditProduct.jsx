import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../assest/styles/components/edit-product.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    purchasePrice: "",
    sellingPrice: "",
    productStock: "", // New state for product stock
    category: "",
    imageURL: ""
  });

  const [showAlert, setShowAlert] = useState(false); // State untuk menampilkan alert
  const [selectedProductCategory, setSelectedProductCategory] = useState('');

  const productCategories = [
    "Penggaris",
    "Buku",
    "Kertas",
    "Lem",
    "Lakban",
    "Alat Tulis",
    "Undangan",
    "Map",
    "Parfum",
    "Elektronik",
    "Print"
  ];

  useEffect(() => {
    fetch(`https://back-end-cashier.vercel.app/product/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setSelectedProductCategory(data.category);
      })
      .catch(error => console.error("Error fetching product details:", error));
  }, [id]);

  const handleChangeSelectedValue = (event) => {
    setSelectedProductCategory(event.target.value);
  };

  const handleUpdateData = (event) => {
    event.preventDefault();
    const form = event.target;

    const productName = form.productName.value;
    const productDescription = form.productDescription.value;
    const purchasePrice = form.purchasePrice.value;
    const sellingPrice = form.sellingPrice.value;
    const productStock = form.productStock.value;
    const category = form.categoryName.value;
    const imageURL = form.imageURL.value;
    const updatedAt = new Date().toISOString();

    const updateProductObj = {
      productName,
      productDescription,
      purchasePrice,
      sellingPrice,
      productStock,
      category,
      imageURL,
      updatedAt
    }

    fetch(`https://back-end-cashier.vercel.app/product/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateProductObj)
    })
      .then(res => res.json())
      .then(data => {
        setShowAlert(true); // Menampilkan alert ketika update berhasil
      })
      .catch(error => {
        console.error("Error updating product:", error);
      });
  };

  const handlePriceChange = (event) => {
    const priceInput = event.target.value;
    if (/^\d*\.?\d*$/.test(priceInput)) {
      setProduct(prevProduct => ({
        ...prevProduct,
        productPrice: priceInput
      }));
    }
  };

  const handleStockChange = (event) => {
    const stockInput = event.target.value;
    if (/^\d*$/.test(stockInput)) {
      setProduct(prevProduct => ({
        ...prevProduct,
        productStock: stockInput
      }));
    }
  };

  const handleOkButtonClick = () => {
    setShowAlert(false); // Menyembunyikan alert ketika tombol "OK" diklik
    navigate('/admin/dashboard/manage'); // Navigate back to manage product page
  };

  return (
    <div>
      <p className='titles'>Update the Product data</p>

      <div className="form-container">
        <form onSubmit={handleUpdateData}>
          <div className="form-group">
            <label htmlFor="productName">Product Name :</label>
            <input
              type="text"
              id="productName"
              name="productName"
              required
              placeholder='Product Name'
              defaultValue={product.productName}
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
              defaultValue={product.productDescription}
            />
          </div>

          <div className="form-group">
            <label htmlFor="purchasePrice">Purchase Price :</label>
            <input
              type="text"
              id="purchasePrice"
              name="purchasePrice"
              required
              placeholder='Purchase Price'
              value={product.purchasePrice}
              onChange={handlePriceChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sellingPrice">Selling Price :</label>
            <input
              type="text"
              id="sellingPrice"
              name="sellingPrice"
              required
              placeholder='Selling Price'
              value={product.sellingPrice}
              onChange={handlePriceChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="productStock">Stock :</label> {/* Input field for stock */}
            <input
              type="text"
              id="productStock"
              name="productStock"
              required
              placeholder='Stock of product'
              value={product.productStock}
              onChange={handleStockChange}
            />
          </div>

          <div className="category--image-con">
            <div className="form-group">
              <label className='wewwws' htmlFor="inputState">Category :</label>
              <select className='menu--option' name="categoryName" id="inputState" value={selectedProductCategory} onChange={handleChangeSelectedValue}>
                {productCategories.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>

            <div className="form-group row">
              <label className='wewwws' htmlFor="imageURL">Images :</label>
              <input
                type="text"
                id="imageURL"
                name="imageURL"
                required
                placeholder='Product Image URL'
                defaultValue={product.imageURL}
              />
            </div>
          </div>

          {showAlert && (
            <div className="upload-success-alert">
              <p className='add--alert'>Product update succeeded</p>
              <button className='add--btn--alert' onClick={handleOkButtonClick}>OK</button>
            </div>
          )}

          <button className='submit--btn' type="submit">Update Product</button>
          <button className='submit--btn' onClick={() => navigate(-1)}>Cancel</button> 
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
