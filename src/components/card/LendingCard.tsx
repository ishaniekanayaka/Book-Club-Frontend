
// components/cards/LendingCard.tsx
import React from 'react';
import toast from 'react-hot-toast';
import { returnBook } from '../../services/LendingService';
import type { Lending } from '../../types/Lending';
import { Calendar, User, Book, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface LendingCardProps {
    lending: Lending;
    onReturn: () => void;
}

const LendingCard: React.FC<LendingCardProps> = ({ lending, onReturn }) => {
    const handleReturn = async () => {
        try {
            await returnBook(lending._id);
            toast.success('Book marked as returned');
            onReturn();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to return book');
        }
    };

    const isOverdue = !lending.isReturned && new Date(lending.dueDate) < new Date();
    const daysOverdue = isOverdue ? Math.floor((Date.now() - new Date(lending.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <div className={`border rounded-xl p-6 shadow-md bg-white space-y-4 ${
            isOverdue ? 'border-red-200 bg-red-50' : lending.isReturned ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
            {/* Status Badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {lending.isReturned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3" />
              Returned
            </span>
                    ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3" />
              Overdue ({daysOverdue} days)
            </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Clock className="h-3 w-3" />
              Active
            </span>
                    )}
                </div>
                <span className="text-xs text-gray-500">ID: {lending._id.slice(-6)}</span>
            </div>

            {/* Reader Info */}
            <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                    <p className="font-medium text-gray-900">{lending.readerId?.fullName}</p>
                    <p className="text-sm text-gray-600">Member ID: {lending.readerId?.memberId}</p>
                    <p className="text-sm text-gray-600">NIC: {lending.readerId?.nic}</p>
                </div>
            </div>

            {/* Book Info */}
            <div className="flex items-start gap-3">
                <Book className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                    <p className="font-medium text-gray-900">{lending.bookId?.title}</p>
                    <p className="text-sm text-gray-600">by {lending.bookId?.author}</p>
                    <p className="text-sm text-gray-600">ISBN: {lending.bookId?.isbn}</p>
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">Lent Date</p>
                        <p className="text-sm font-medium">{new Date(lending.lendDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                            {new Date(lending.dueDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {lending.returnDate && (
                <div className="flex items-center gap-2 pt-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                        <p className="text-xs text-gray-500">Returned Date</p>
                        <p className="text-sm font-medium text-green-600">
                            {new Date(lending.returnDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            )}

            {/* Fine Amount */}
            {lending.fineAmount && lending.fineAmount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm font-medium text-yellow-800">
                        Fine Amount: Rs. {lending.fineAmount.toFixed(2)}
                    </p>
                </div>
            )}

            {/* Action Button */}
            {!lending.isReturned && (
                <button
                    onClick={handleReturn}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    Mark as Returned
                </button>
            )}

            {/* Additional Info */}
            <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                <p>Lent by: {lending.lentBy}</p>
                {lending.returnedBy && <p>Returned by: {lending.returnedBy}</p>}
                {lending.notes && <p>Notes: {lending.notes}</p>}
            </div>
        </div>
    );
};

export default LendingCard;