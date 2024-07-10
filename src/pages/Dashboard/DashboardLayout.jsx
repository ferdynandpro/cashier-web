// import { Sidebar } from 'flowbite-react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import '../../assest/styles/components/dashboard-layout.css'
import Dashboard from './Dashboard'


const DashboardLayout = () => {
  return (
    <div className='layout'>
      <Sidebar/>
      <div className="outlet">
      <Outlet/>
      {/* <Dashboard/> */}
      </div>
    </div>
  )
}

export default DashboardLayout
