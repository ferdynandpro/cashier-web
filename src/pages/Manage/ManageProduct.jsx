import React, { useEffect, useState } from 'react';
import '../../assest/styles/components/manage-product.css';
import ProductTable from '../../components/ProductTable/ProductTable';
import SearchBar from '../../components/SearchBar/SearchBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ManageProduct = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(error => console.error("Error fetching data:", error));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/product/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        fetchProducts();
      })
      .catch(error => console.error("Error deleting product:", error));
  };

  const confirmDelete = (id) => {
    setShowDeleteConfirmation(true);
    setProductToDelete(id);
  };

  const handleConfirmDelete = () => {
    handleDelete(productToDelete);
    setShowDeleteConfirmation(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setProductToDelete(null);
  };

  const handleEdit = (id) => {
    // Placeholder for edit functionality if needed
    console.log("Edit product with ID:", id);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text('Product List Photocopy Ganda', 14, 10);

    const tableColumnNames = ['No', 'Product Name', 'Category', 'Purchase Price', 'Selling Price'];
    const tableRows = [];

    const productsToDownload = selectedCategory === 'All' ? allProducts : allProducts.filter(product => product.category === selectedCategory);

    productsToDownload.forEach((product, index) => {
      tableRows.push([
        index + 1,
        product.productName,
        product.category,
        formatPrice(product.purchasePrice),
        formatPrice(product.sellingPrice)
      ]);
    });

    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      theme: 'grid',
      styles: { overflow: 'linebreak', cellWidth: 'wrap' }
    });

    doc.save('product_list.pdf');
  };

  const filteredProducts = allProducts.filter(product =>
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='manage--container'>
      <p className='titles'>Manage</p>
      <div className="manage--content">
        <div className="button-container">
          <select className='select--by' value={selectedCategory} onChange={handleCategoryChange}>
            <option value="All">All Categories</option>
            {Array.from(new Set(allProducts.map(product => product.category))).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button className='download-btn' onClick={handleDownloadPDF}>Download List Of Product</button>
        </div>
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
        <ProductTable
          products={filteredProducts}
          formatPrice={formatPrice}
          confirmDelete={confirmDelete}
          handleEdit={handleEdit} // Pass handleEdit if needed in ProductTable
        />
      </div>
      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p className='delete--message'>Are you sure you want to delete this product?</p>
            <div className='delete--message'>
              <button className='yes--no' onClick={handleConfirmDelete}>Yes</button>
              <button className='yes--no' onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
