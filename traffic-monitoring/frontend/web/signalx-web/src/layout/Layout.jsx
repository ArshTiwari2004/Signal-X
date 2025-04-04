import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
    return (
        <div className="flex bg-gray-950 text-white min-h-screen">
            <Sidebar />
            <div className="flex-1">
                <Header />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout