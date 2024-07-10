import React, { useState, useEffect } from 'react';
import '../../assest/styles/components/product-list.css';
import ProductFilter from '../ProductFilter/ProductFilter';
import SearchBar from '../SearchBar/SearchBar';

const ProductList = ({ onSelectProduct }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch products from backend on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    // Handle search term change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Update filtered products based on search term and stock status
    useEffect(() => {
        const sortedProducts = [...products].sort((a, b) => {
            if (a.productStock === 0 && b.productStock !== 0) {
                return 1;
            } else if (a.productStock !== 0 && b.productStock === 0) {
                return -1;
            } else {
                return 0;
            }
        });

        const filtered = sortedProducts.filter(product =>
            product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [products, searchTerm]);

    // Function to format price to Indonesian currency (Rupiah)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    return (
        <div className="prod--list-container">
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
            <ProductFilter products={products} onFilter={setFilteredProducts} />
            <div className='product-list-container'>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div className={`product-card ${product.productStock === 0 ? 'out-of-stock' : ''}`} key={index}>
                            <img className='product-image' src={product.imageURL} alt={product.productName} />
                            <div className='product-details'>
                                <p className='product-name'>{product.productName}</p>
                                <p className='product-price'>{formatPrice(product.sellingPrice)}</p>
                                <p className='product-stock'>Stock: {product.productStock}</p>
                            </div>
                            {product.productStock > 0 ? (
                                <button className={'add-to-cart-btn'} onClick={() => onSelectProduct(product)}>Add</button>
                            ) : (
                                <p className='out-of-stock-text'>Out of Stock</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>NO PRODUCT FOUND</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;
