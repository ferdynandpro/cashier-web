import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../assest/styles/components/profit-summary.css';

const ProfitSummary = () => {
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredSummary, setFilteredSummary] = useState({});
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const fetchPaymentLogs = async () => {
      try {
        const response = await fetch("https://back-end-cashier.vercel.app/bukti-pembayaran");
        if (!response.ok) {
          throw new Error('Failed to fetch payment logs');
        }
        const data = await response.json();
        setPaymentLogs(data);
      } catch (error) {
        console.error('Error fetching payment logs:', error);
      }
    };

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

    fetchPaymentLogs();
    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredSummaryByMonthAndYear = () => {
      const summary = {};
      paymentLogs.forEach((log) => {
        if (log.details && log.details.length > 0) {
          const logDate = new Date(log.tanggal_pembayaran);
          const logMonth = logDate.getMonth() + 1;
          const logYear = logDate.getFullYear();
          if (
            (selectedMonth === '' || logMonth === Number(selectedMonth)) &&
            (selectedYear === '' || logYear === Number(selectedYear))
          ) {
            log.details.forEach((detail) => {
              if (!summary[detail.productName]) {
                const product = products.find(p => p.productName === detail.productName);
                summary[detail.productName] = {
                  totalQuantity: 0,
                  purchasePrice: product ? product.purchasePrice : 0,
                  sellingPrice: product ? product.sellingPrice : 0,
                  profit: 0
                };
              }
              summary[detail.productName].totalQuantity += detail.productQuantity;
              summary[detail.productName].profit += detail.productQuantity * (summary[detail.productName].sellingPrice - summary[detail.productName].purchasePrice);
            });
          }
        }
      });
      return summary;
    };

    const filteredSummary = filteredSummaryByMonthAndYear();
    setFilteredSummary(filteredSummary);

    // Calculate total profit
    const total = Object.values(filteredSummary).reduce((acc, summary) => acc + (summary.profit || 0), 0);
    setTotalProfit(total);
  }, [selectedMonth, selectedYear, paymentLogs, products]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const monthName = selectedMonth ? new Date(Date.parse(`2023-${selectedMonth}-01`)).toLocaleString('default', { month: 'long' }) : 'All Months';
    const yearName = selectedYear || 'All Years';
    
    doc.text(`Profit Summary - ${monthName} ${yearName}`, 14, 10);
    
    const tableColumnNames = ['Product Name', 'Product Quantity', 'Purchase Price', 'Selling Price', 'Profit'];
    const tableRows = [];
    
    Object.entries(filteredSummary).forEach(([productName, summary], index) => {
      tableRows.push([
        productName,
        summary.totalQuantity,
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.purchasePrice),
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.sellingPrice),
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.profit || 0)
      ]);
    });
    
    // Add total row
    tableRows.push(['Total', '', '', '', new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalProfit)]);
    
    doc.autoTable({
      startY: 20,
      head: [tableColumnNames],
      body: tableRows,
      theme: 'grid',
      styles: { overflow: 'linebreak', cellWidth: 'wrap' }
    });
    
    doc.save(`profit_summary_${selectedMonth ? selectedMonth : 'all_months'}_${selectedYear ? selectedYear : 'all_years'}.pdf`);
  };

  return (
    <div className="container">
      <p className='titles'>Profit Summary</p>
      <div className="filter--container">
          <div className="qiw">
      <label htmlFor="year">Select Year:</label>
        <select className='select--by'  id="year" value={selectedYear} onChange={handleYearChange}>
          <option value="">All Years</option>
          {Array.from(new Set(paymentLogs.map(log => new Date(log.tanggal_pembayaran).getFullYear()))).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <label htmlFor="month">Select Month:</label>
        <select className='select--by' id="month" value={selectedMonth} onChange={handleMonthChange}>
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        </div>
        
        <div className="button-container">
          <button className='download-btn' onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      </div>
      <div className="profit-summary">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Quantity</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredSummary).map(([productName, summary], index) => (
              <tr key={index}>
                <td>{productName}</td>
                <td>{summary.totalQuantity}</td>
                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.purchasePrice)}</td>
                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.sellingPrice)}</td>
                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(summary.profit || 0)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{Object.values(filteredSummary).reduce((acc, summary) => acc + (summary.totalQuantity || 0), 0)}</td>
              <td></td>
              <td></td>
              <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalProfit || 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div> 
    </div>
  );
};

export default ProfitSummary;
