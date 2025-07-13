import React from "react";

const ReaderDashboard: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold text-green-700 mb-4">📚 Reader Dashboard</h1>
                <p className="text-gray-600">Welcome to your dashboard. Here you can:</p>
                <ul className="list-disc list-inside text-left mt-4 text-gray-700">
                    <li>View and borrow books</li>
                    <li>Track your borrowing history</li>
                    <li>Check overdue books</li>
                    <li>Update your profile</li>
                </ul>
            </div>
        </div>
    );
};

export default ReaderDashboard;