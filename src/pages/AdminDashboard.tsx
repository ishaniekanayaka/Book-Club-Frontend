import React, { useEffect, useState } from "react";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import { getDashboardSummary } from "../services/dashboardService";
import { MdPersonAdd, MdBook, MdAssignment } from "react-icons/md";

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalReaders: 0,
        totalStaff: 0,
        totalLibrarians: 0,
        activeLendings: 0,
        overdueBooks: 0,
    });

    // Chart data structure
    const [chartData, setChartData] = useState<
        { name: string; count: number }[]
    >([]);

    useEffect(() => {
        getDashboardSummary()
            .then((res) => {
                const data = res.data;
                setStats(data);

                // Transform summary to array for chart
                setChartData([
                    { name: "Books", count: data.totalBooks },
                    { name: "Readers", count: data.totalReaders },
                    { name: "Staff", count: data.totalStaff },
                    { name: "Librarians", count: data.totalLibrarians },
                    { name: "Active Lendings", count: data.activeLendings },
                    { name: "Overdue Books", count: data.overdueBooks },
                ]);
            })
            .catch((err) =>
                console.error("Failed to fetch dashboard summary data", err)
            );
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Library Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome back! Here's what's happening in your library.
                    </p>
                </div>

                {/* Stats */}
                <DashboardStats {...stats} />

                {/* Chart */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Overview
                    </h3>
                    <DashboardCharts data={chartData} />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                            <MdBook className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900">Add Book</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                            <MdPersonAdd className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900">Add Reader</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                            <MdAssignment className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900">Create Lending</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
