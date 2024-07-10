import React, { useState } from 'react';
import '../../assest/styles/components/product-filter.css'
const ProductFilter = ({ products, onFilter }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const productCategories = [
    "All", "Penggaris", "Buku", "Kertas", "Lem", "Lakban", "Alat Tulis",
    "Undangan", "Map", "Parfum", "Elektronik", "Print"
  ];

  const filterByCategory = (category) => {
    if (category === "All") {
      onFilter(products); // Mengembalikan semua produk tanpa filter
      setErrorMessage('');
    } else {
      const filtered = products.filter(product => product.category === category);
      onFilter(filtered);
      if (filtered.length === 0) {
        setErrorMessage(`No products in the ${category} category.`);
      } else {
        setErrorMessage('');
      }
    }
  };

  

  return (
    <div>
      <div className="filter-buttons">
        {productCategories.map(category => (
          <button className='btn--filter-menu' key={category} onClick={() => filterByCategory(category)}>{category}</button>
        ))}
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ProductFilter;
