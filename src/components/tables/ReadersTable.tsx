import React from "react"
import type { Reader } from "../../types/Reader"
import {Edit2, Mail, Phone, Trash2, User, Users} from "lucide-react"


// Professional Readers Table Component
const ReadersTable: React.FC<{
    readers: Reader[]
    onEdit: (reader: Reader) => void
    onDelete: (id: string) => void
    isLoading?: boolean
}> = ({ readers, onEdit, onDelete, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="ml-3 text-gray-600">Loading readers...</span>
                </div>
            </div>
        )
    }

    if (readers.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No readers found</h3>
                <p className="text-gray-500">Start by adding your first reader to the system.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reader Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {readers.map((reader) => (
                        <tr key={reader._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{reader.fullName}</div>
                                        <div className="text-sm text-gray-500">{reader.memberId || 'No ID'}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 flex items-center gap-1">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {reader.email}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {reader.phone || 'N/A'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">NIC: {reader.nic}</div>
                                <div className="text-sm text-gray-500">
                                    DOB: {reader.dateOfBirth ? new Date(reader.dateOfBirth).toLocaleDateString() : 'N/A'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      reader.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                  }`}>
                    {reader.status || 'Active'}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(reader)}
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                        title="Edit reader"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(reader._id)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                        title="Delete reader"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ReadersTable
