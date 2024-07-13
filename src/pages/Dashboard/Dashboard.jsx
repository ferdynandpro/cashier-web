import React, { useEffect, useState } from 'react';
import LowestStock from '../../components/LowestStock/LowestStock';
// import ProfitSummary from '../../components/ProfitSummary/ProfitSummary';
import LastProduct from '../../components/LastAdd/LastProduct';
import ProductCount from '../../components/Product-Count/ProductCount';
import '../../assest/styles/components/dashboard.css';
import TransactionCount from '../../components/TransactionCount/TransactionCount';

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  useEffect(() => {
    fetchProductCount();
    fetchTransactionCount();
  }, []);

  const fetchProductCount = () => {
    fetch("https://back-end-cashier-api.vercel.app/products")
      .then(res => res.json())
      .then(data => setProductCount(data.length)) // Menghitung jumlah produk
      .catch(error => console.error("Error fetching product count:", error));
  };

  const fetchTransactionCount = () => {
    fetch('http://localhost:5000/bukti-pembayaran')
      .then(res => res.json())
      .then(data => setTransactionCount(data.length)) // Menghitung jumlah transaksi
      .catch(error => console.error('Error fetching transaction count:', error));
  };

  return (
    <div className='container'>
      <div className="titles">Dashboard</div>
      <div className="dashboard--card">
        <div className="dash--card">
          <ProductCount className="kotak--kiri" count={productCount} />
          <TransactionCount className="kotak--kanan" count={transactionCount} /> {/* Pass transaction count */}
        </div>
        <LowestStock />
      </div>
      <LastProduct />
    </div>
  );
};

export default Dashboard;
