import React from "react"

import { MdInventory, MdPerson, MdShoppingCart } from "react-icons/md"


const DashboardPage: React.FC = () => {
  // Sample data - in real app, this would come from API



  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
          <p className='text-gray-600 mt-1'>Welcome back! Here's what's happening with your business.</p>
        </div>


        {/* Recent Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2'>
            {/* This space can be used for additional charts or tables */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Quick Actions</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150'>
                  <MdShoppingCart className='w-8 h-8 text-indigo-600 mx-auto mb-2' />
                  <p className='text-sm font-medium text-gray-900'>Create Order</p>
                </button>
                <button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150'>
                  <MdPerson className='w-8 h-8 text-green-600 mx-auto mb-2' />
                  <p className='text-sm font-medium text-gray-900'>Add Customer</p>
                </button>
                <button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150'>
                  <MdInventory className='w-8 h-8 text-purple-600 mx-auto mb-2' />
                  <p className='text-sm font-medium text-gray-900'>Add Item</p>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DashboardPage
