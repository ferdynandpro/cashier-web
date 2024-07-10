import React, { useState } from 'react';
import '../../assest/styles/components/pembayaran.css';
import ProductList from '../../components/ProductList/ProductList';
import Payment from '../../components/Payment/Payment';

const Pembayaran = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleProductSelect = (product) => {
        setSelectedProducts(prevProducts => {
            const existingProduct = prevProducts.find(p => p.productName === product.productName);
            if (existingProduct) {
                return prevProducts.map(p =>
                    p.productName === product.productName ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                return [...prevProducts, { ...product, quantity: 1 }];
            }
        });
    };

    const handleUpdateQuantity = (productName, amount) => {
        setSelectedProducts(prevProducts => {
            const updatedProducts = prevProducts.map(p => {
                if (p.productName === productName) {
                    const newQuantity = p.quantity + amount;
                    if (newQuantity > 0) {
                        return { ...p, quantity: newQuantity };
                    } else {
                        return null; // Mark this product to be removed
                    }
                }
                return p;
            }).filter(p => p !== null); // Remove null entries
            return updatedProducts;
        });
    };

    const handlePayment = () => {
        setSelectedProducts([]);
    };

    return (
        <div className="container">
      <p className='titles'>Cashier</p>
            <div className="cart--container">
                <div className="left">
                    <ProductList onSelectProduct={handleProductSelect} />
                </div>
                <div className="right">
                    <Payment 
                        selectedProducts={selectedProducts} 
                        onUpdateQuantity={handleUpdateQuantity} 
                        onPayment={handlePayment} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Pembayaran;
