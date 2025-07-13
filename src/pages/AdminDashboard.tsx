import React from "react";

const AdminDashboard: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold text-blue-700 mb-4">🛠 Admin Dashboard</h1>
                <p className="text-gray-600">Welcome to your admin panel. Here you can:</p>
                <ul className="list-disc list-inside text-left mt-4 text-gray-700">
                    <li>Manage users and librarians</li>
                    <li>View system reports</li>
                    <li>Manage book inventory</li>
                    <li>Monitor overdue books</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;