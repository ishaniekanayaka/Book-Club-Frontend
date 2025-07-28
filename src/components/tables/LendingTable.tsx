import React, { useState } from 'react';
import type { Lending } from '../../types/Lending';
import { CheckCircle, AlertTriangle, Clock, Search, Filter } from 'lucide-react';
import { returnBook } from '../../services/LendingService';
import toast from 'react-hot-toast';

interface LendingTableProps {
    lendings: Lending[];
    onRefresh: () => void;
}

const LendingTable: React.FC<LendingTableProps> = ({ lendings, onRefresh }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'returned' | 'overdue'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleReturn = async (lendingId: string) => {
        try {
            await returnBook(lendingId);
            toast.success('Book marked as returned');
            onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to return book');
        }
    };

    const getFilteredLendings = () => {
        let filtered = lendings;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(lending =>
                lending.readerId?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lending.bookId?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lending.readerId?.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lending.bookId?.isbn.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(lending => {
                const isOverdue = !lending.isReturned && new Date(lending.dueDate) < new Date();
                switch (statusFilter) {
                    case 'active':
                        return !lending.isReturned && !isOverdue;
                    case 'returned':
                        return lending.isReturned;
                    case 'overdue':
                        return isOverdue;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    };

    const filteredLendings = getFilteredLendings();
    const totalPages = Math.ceil(filteredLendings.length / itemsPerPage);
    const paginatedLendings = filteredLendings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (lending: Lending) => {
        const isOverdue = !lending.isReturned && new Date(lending.dueDate) < new Date();

        if (lending.isReturned) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" />
          Returned
        </span>
            );
        } else if (isOverdue) {
            const daysOverdue = Math.floor((Date.now() - new Date(lending.dueDate).getTime()) / (1000 * 60 * 60 * 24));
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3" />
          Overdue ({daysOverdue}d)
        </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="h-3 w-3" />
          Active
        </span>
            );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">Lending Records</h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by reader, book, member ID, or ISBN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="returned">Returned</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reader</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lend Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedLendings.map((lending) => (
                        <tr key={lending._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{lending.readerId?.fullName}</div>
                                    <div className="text-sm text-gray-500">ID: {lending.readerId?.memberId}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div>
                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{lending.bookId?.title}</div>
                                    <div className="text-sm text-gray-500">{lending.bookId?.isbn}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(lending.lendDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${
                      !lending.isReturned && new Date(lending.dueDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-900'
                  }`}>
                    {new Date(lending.dueDate).toLocaleDateString()}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(lending)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {lending.fineAmount ? `Rs. ${lending.fineAmount.toFixed(2)}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {!lending.isReturned && (
                                    <button
                                        onClick={() => handleReturn(lending._id)}
                                        className="text-blue-600 hover:text-blue-900 font-medium"
                                    >
                                        Return
                                    </button>
                                )}
                                {lending.returnDate && (
                                    <span className="text-green-600 text-xs">
                      Returned {new Date(lending.returnDate).toLocaleDateString()}
                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLendings.length)} of {filteredLendings.length} results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {filteredLendings.length === 0 && (
                <div className="p-12 text-center">
                    <div className="text-gray-400 text-lg mb-2">No lending records found</div>
                    <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
                </div>
            )}
        </div>
    );
};

export default LendingTable;