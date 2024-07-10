import React, { useState, useEffect } from 'react';
import PaymentLogDetails from './PaymentLogDetails'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../assest/styles/components/payment-logs.css';

const PaymentLogs = () => {
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    // Fetch payment logs
    const fetchPaymentLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/bukti-pembayaran');
        if (!response.ok) {
          throw new Error('Failed to fetch payment logs');
        }
        const data = await response.json();
        setPaymentLogs(data);
      } catch (error) {
        console.error('Error fetching payment logs:', error);
      }
    };

    fetchPaymentLogs();
  }, []);

  const handlePaymentClick = (paymentId) => {
    setSelectedPaymentId(paymentId);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleDownloadPDF = () => {
    let selectedMonthName = selectedMonth ? document.getElementById("month").options[document.getElementById("month").selectedIndex].text : 'All Months';
    selectedMonthName = selectedMonthName.charAt(0).toUpperCase() + selectedMonthName.slice(1); // Uppercase first letter
    const doc = new jsPDF();
    doc.text(`Payment Logs - ${selectedMonthName}`, 14, 10);

    const tableColumnNames = ['No', 'Payment ID', 'Date'];
    const tableRows = [];

    const logsToPrint = selectedMonth ? filteredPaymentLogs : paymentLogs;
    logsToPrint.forEach((log, index) => {
      const rowData = [
        index + 1,
        log._id,
        new Date(log.tanggal_pembayaran).toLocaleString('id-ID')
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      startY: 20,
      head: [tableColumnNames],
      body: tableRows,
      theme: 'striped',
      styles: { overflow: 'linebreak', cellWidth: 'wrap' }
    });

    doc.save(`payment_logs_${selectedMonth ? selectedMonth : 'all_months'}.pdf`);
  };

  const handleDownloadPaymentReceipt = async () => {
    if (!selectedPaymentId) return;

    try {
      const response = await fetch(`http://localhost:5000/bukti-pembayaran/${selectedPaymentId}/detail`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }
      const paymentDetails = await response.json();

      // Generate PDF receipt
      const doc = new jsPDF();
      doc.text(`Payment Receipt - Payment ID: ${selectedPaymentId}`, 14, 10);

      const tableColumnNames = ['No', 'Product Name', 'Quantity', 'Total Price'];
      const tableRows = [];

      paymentDetails.forEach((detail, index) => {
        const rowData = [
          index + 1,
          detail.productName,
          detail.productQuantity,
          `Rp. ${detail.totalPrice.toLocaleString('id-ID')}`
        ];
        tableRows.push(rowData);
      });

      doc.autoTable({
        startY: 20,
        head: [tableColumnNames],
        body: tableRows,
        theme: 'grid',
        styles: { overflow: 'linebreak', columnWidth: 'wrap' }
      });

      doc.save(`payment_receipt_${selectedPaymentId}.pdf`);
    } catch (error) {
      console.error('Error fetching or generating payment receipt:', error);
    }
  };

  // Filter payment logs based on selected month
  const filteredPaymentLogs = selectedMonth
    ? paymentLogs.filter(log => {
        const logDate = new Date(log.tanggal_pembayaran);
        const logMonth = logDate.getMonth() + 1;
        return logMonth === Number(selectedMonth);
      })
    : paymentLogs;

  const sortLogsByDate = () => {
    const sortedLogs = [...paymentLogs].sort((a, b) => {
      return new Date(b.tanggal_pembayaran) - new Date(a.tanggal_pembayaran);
    });
    setPaymentLogs(sortedLogs);
  };

  const sortLogsByOldest = () => {
    const sortedLogs = [...paymentLogs].sort((a, b) => {
      return new Date(a.tanggal_pembayaran) - new Date(b.tanggal_pembayaran);
    });
    setPaymentLogs(sortedLogs);
  };

  return (
    <div className="payment-logs-page">
      <p className="titles">Payment Logs</p>
      <div className="filter-container">
        <div className="qiw">
        <label htmlFor="month">Select Month:</label>
        <select className='select--bys' id="month" value={selectedMonth} onChange={handleMonthChange}>
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
          <button className='payment--logs-btn' onClick={sortLogsByDate}>Newest Payment</button>
          <button className='payment--logs-btn' onClick={sortLogsByOldest}>Oldest Payment</button>
          <button className='payment--logs-btn' onClick={handleDownloadPDF}>Download PDF</button>
          {selectedPaymentId && (
            <button className='payment--logs-btn' onClick={handleDownloadPaymentReceipt}>Download Payment Detail</button>
          )}
        </div>
      </div>
      <div className="data--payment">
        <div className="table--data">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th className="payment-id-col">Payment ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPaymentLogs.map((log, index) => (
                <tr key={log._id} onClick={() => handlePaymentClick(log._id)}>
                  <td>{index + 1}</td>
                  <td className="payment-id-col">{log._id}</td>
                  <td>{new Date(log.tanggal_pembayaran).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="isidata">
            <p className='titles'>Payment Detail</p>
            {selectedPaymentId && <PaymentLogDetails paymentId={selectedPaymentId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentLogs;
