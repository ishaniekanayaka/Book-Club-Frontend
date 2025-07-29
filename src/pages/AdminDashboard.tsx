import React, { useEffect, useState } from "react";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import { getDashboardSummary } from "../services/dashboardService";
import { MdPersonAdd, MdBook, MdAssignment, MdDashboard, MdRefresh } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalReaders: 0,
        totalStaff: 0,
        totalLibrarians: 0,
        activeLendings: 0,
        overdueBooks: 0,
    });

    const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = () => {
        setIsLoading(true);
        getDashboardSummary()
            .then((res) => {
                const data = res.data;
                setStats(data);
                setChartData([
                    { name: "Books", count: data.totalBooks },
                    { name: "Readers", count: data.totalReaders },
                    { name: "Staff", count: data.totalStaff },
                    { name: "Librarians", count: data.totalLibrarians },
                    { name: "Active Lendings", count: data.activeLendings },
                    { name: "Overdue Books", count: data.overdueBooks },
                ]);
            })
            .catch((err) => {
                console.error("Failed to fetch dashboard summary data", err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <MdDashboard className="text-indigo-600" />
                            Library Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isLoading ? "Loading data..." : "Welcome back! Here's what's happening in your library."}
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition duration-200 shadow-sm border border-gray-200"
                    >
                        <MdRefresh className={`${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {/* Stats */}
                        <motion.div variants={itemVariants}>
                            <DashboardStats {...stats} />
                        </motion.div>

                        {/* Chart */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Library Overview
                                </h3>
                                <div className="flex gap-2">
                                    <button className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                                        This Month
                                    </button>
                                    <button className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                                        This Year
                                    </button>
                                </div>
                            </div>
                            <DashboardCharts data={chartData} />
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/adminDashboard/books")}
                                    className="group p-5 border border-gray-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition duration-200 flex flex-col items-center"
                                >
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition duration-200">
                                        <MdBook className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Add New Book</p>
                                    <p className="text-xs text-gray-500 mt-1">Add to library collection</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/adminDashboard/readers")}
                                    className="group p-5 border border-gray-200 rounded-xl hover:border-green-200 hover:bg-green-50 transition duration-200 flex flex-col items-center"
                                >
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200 transition duration-200">
                                        <MdPersonAdd className="w-6 h-6 text-green-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Register Reader</p>
                                    <p className="text-xs text-gray-500 mt-1">Create new reader account</p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/adminDashboard/lending")}
                                    className="group p-5 border border-gray-200 rounded-xl hover:border-purple-200 hover:bg-purple-50 transition duration-200 flex flex-col items-center"
                                >
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition duration-200">
                                        <MdAssignment className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Create Lending</p>
                                    <p className="text-xs text-gray-500 mt-1">Lend books to readers</p>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Recent Activity Section */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: item * 0.1 }}
                                        className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition duration-150"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MdBook className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">New book added</p>
                                            <p className="text-xs text-gray-500">"The Great Novel" was added to collection</p>
                                        </div>
                                        <span className="text-xs text-gray-400">2 hours ago</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;