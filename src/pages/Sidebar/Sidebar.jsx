import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { GrUserManager } from "react-icons/gr";
import { MdOutlinePayment } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for burger and close button
import '../../assest/styles/components/sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div className='burger-button' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <FaBars />
        <a href="/admin/dashboard/dashboard" className="nav--logo">Foto Copy Ganda</a>
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar--logo">
          <a href="/admin/dashboard/dashboard" className="nav--logo">Foto Copy Ganda</a>
        </div>

        <div className="sidebar--comp">
          <NavLink
            to="dashboard"
            className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}
          >
            <MdOutlineSpaceDashboard className='sidebar--icon' />
            <span className='sidebar-link'>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/pembayaran"
            className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}
          >
            <MdOutlinePayment className='sidebar--icon' />
            <span className='sidebar-link'>Cashier</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/upload"
            className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}
          >
            <IoMdAdd className='sidebar--icon' />
            <span className='sidebar-link'>Add Product</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/manage"
            className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}
          >
            <GrUserManager className='sidebar--icon' />
            <span className='sidebar-link'>Manage Product</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/payment-logs"
            className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}
          >
            <MdEditNote className='sidebar--icon' />
            <span className='sidebar-link'>Payment Logs</span>
          </NavLink>
          <NavLink
            to="/admin/dashboard/profit-summary"
            className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}
          >
            <FaMoneyBillWave className='sidebar--icon' />
            <span className='sidebar-link'>Profit Summary</span>
          </NavLink>
          <button onClick={() => setShowLogoutConfirmation(true)} className="logout-btn">Logout</button>
        </div>

        <div className='close-button' onClick={() => setIsSidebarOpen(false)}>
          <FaTimes />
        </div>

        {showLogoutConfirmation && (
          <div className="modal">
            <div className="modal-content">
              <p className='vldt'>Are you sure you want to logout?</p>
              <div className='vldt'>
                <button onClick={handleLogout}>Yes</button>
                <button onClick={() => setShowLogoutConfirmation(false)}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
