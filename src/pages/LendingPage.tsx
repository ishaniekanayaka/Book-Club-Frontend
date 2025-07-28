import React, { useEffect, useState } from 'react';
import { getAllLendings, getOverdueLendings, sendOverdueNotifications } from '../services/LendingService';
import type { Lending } from '../types/Lending';

import LendingTable from '../components/tables/LendingTable';
import LendBookForm from '../components/forms/LendBookForm';
import { Book, AlertTriangle, CheckCircle, Clock, Mail, Grid, List, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import LendingCard from "../components/card/LendingCard.tsx";

const LendingPage: React.FC = () => {
    const [lendings, setLendings] = useState<Lending[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'overdue'>('all');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [showLendForm, setShowLendForm] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        overdue: 0,
        returned: 0
    });

    const fetchLendings = async () => {
        try {
            setLoading(true);
            const data = filter === 'all' ? await getAllLendings() : await getOverdueLendings();
            setLendings(data);

            // Calculate stats
            const total = data.length;
            const active = data.filter(l => !l.isReturned && new Date(l.dueDate) >= new Date()).length;
            const overdue = data.filter(l => !l.isReturned && new Date(l.dueDate) < new Date()).length;
            const returned = data.filter(l => l.isReturned).length;

            setStats({ total, active, overdue, returned });
        } catch (err) {
            console.error('Failed to fetch lendings', err);
            toast.error('Failed to fetch lending records');
        } finally {
            setLoading(false);
        }
    };

    const handleSendNotifications = async () => {
        try {
            await sendOverdueNotifications();
            toast.success('Overdue notifications sent successfully!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send notifications');
        }
    };

    useEffect(() => {
        fetchLendings();
    }, [filter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lending Management</h1>
                        <p className="text-gray-600 mt-1">Manage your library's book lending system</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowLendForm(!showLendForm)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Plus className="h-4 w-4" />
                            Lend Book
                        </button>

                        <button
                            onClick={handleSendNotifications}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <Mail className="h-4 w-4" />
                            Send Overdue Notifications
                        </button>
                    </div>
                </div>

                {/* Lend Book Form */}
                {showLendForm && (
                    <LendBookForm onSuccess={() => {
                        fetchLendings();
                        setShowLendForm(false);
                    }} />
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Lendings</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Book className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Lendings</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Overdue</p>
                                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Returned</p>
                                <p className="text-2xl font-bold text-green-600">{stats.returned}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                All Lendings ({stats.total})
                            </button>
                            <button
                                onClick={() => setFilter('overdue')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    filter === 'overdue'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                Overdue Only ({stats.overdue})
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">View:</span>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md ${
                                viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`p-2 rounded-md ${
                                viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {viewMode === 'table' ? (
                    <LendingTable lendings={lendings} onRefresh={fetchLendings} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lendings.map((lending) => (
                            <LendingCard key={lending._id} lending={lending} onReturn={fetchLendings} />
                        ))}
                        {lendings.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No lending records found</h3>
                                <p className="text-gray-600">
                                    {filter === 'overdue'
                                        ? 'No overdue books at the moment.'
                                        : 'Start by lending your first book to a reader.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LendingPage;