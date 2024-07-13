import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Loginx register/Login';
import Register from './components/Loginx register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Pembayaran from './pages/Payment/Pembayaran';
import AddProduct from './pages/Add-Product/AddProduct';
import ManageProduct from './pages/Manage/ManageProduct';
import Payment from './components/Payment/Payment';
import PaymentLogs from './components/PaymentLogs/PaymentLogs';
import ProfitSummary from './components/ProfitSummary/ProfitSummary';
import EditProduct from './pages/Update-Product/EditProduct';

import '../src/assest/styles/global/global.css'

const PrivateRoute = ({ element: Element }) => {
  const token = localStorage.getItem('token');
  return token ? <Element /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        // <Route path="/login" element={<Login />} />
        // <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<PrivateRoute element={DashboardLayout} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pembayaran" element={<PrivateRoute element={Pembayaran} />} />
          <Route path="upload" element={<PrivateRoute element={AddProduct} />} />
          <Route path="manage" element={<PrivateRoute element={ManageProduct} />} />
          <Route path="payment" element={<PrivateRoute element={Payment} />} />
          <Route path="payment-logs" element={<PrivateRoute element={PaymentLogs} />} />
          <Route path="profit-summary" element={<PrivateRoute element={ProfitSummary} />} />
          <Route path="edit-product/:id" element={<PrivateRoute element={EditProduct} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
