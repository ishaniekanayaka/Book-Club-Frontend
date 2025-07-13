import React from "react";

const LibrarianDashboard: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold text-purple-700 mb-4">📖 Librarian Dashboard</h1>
                <p className="text-gray-600">Welcome to your librarian workspace. Here you can:</p>
                <ul className="list-disc list-inside text-left mt-4 text-gray-700">
                    <li>Manage book lending</li>
                    <li>Check and update book statuses</li>
                    <li>Manage overdue follow-ups</li>
                    <li>Assist readers with borrowing</li>
                </ul>
            </div>
        </div>
    );
};

export default LibrarianDashboard;