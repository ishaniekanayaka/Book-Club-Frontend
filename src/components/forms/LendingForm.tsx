import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { lendBook } from '../../services/LendingService';
import { User, Book} from 'lucide-react';

interface LendBookFormProps {
    onSuccess: () => void;
}

const LendBookForm: React.FC<LendBookFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        identifierType: 'memberId' as 'memberId' | 'nic',
        identifier: '',
        isbn: '',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const identifierObj = {
                [formData.identifierType]: formData.identifier
            };

            await lendBook(identifierObj, formData.isbn);
            toast.success('Book lent successfully!');
            setFormData({
                identifierType: 'memberId',
                identifier: '',
                isbn: '',
                notes: ''
            });
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to lend book');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
                <Book className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Lend a Book</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reader Identification Type
                        </label>
                        <select
                            value={formData.identifierType}
                            onChange={(e) => setFormData({...formData, identifierType: e.target.value as 'memberId' | 'nic'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="memberId">Member ID</option>
                            <option value="nic">NIC</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {formData.identifierType === 'memberId' ? 'Member ID' : 'NIC'}
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formData.identifier}
                                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                                placeholder={`Enter ${formData.identifierType === 'memberId' ? 'Member ID' : 'NIC'}`}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Book ISBN
                    </label>
                    <div className="relative">
                        <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={formData.isbn}
                            onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                            placeholder="Enter book ISBN"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Any additional notes..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Lend Book'}
                </button>
            </form>
        </div>
    );
};

export default LendBookForm;
