import React from "react";
import { Edit2, Trash2, User, Calendar, Mail, Phone, Home, Hash, Eye } from "lucide-react";
import type { Staff } from "../../types/Staff";

interface StaffCardProps {
    staff: Staff;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, onClose, onEdit, onDelete }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleBadgeColor = (role: string) => {
        const colors = {
            admin: "bg-purple-500",
            staff: "bg-blue-500",
            librarian: "bg-green-500",
            reader: "bg-gray-500"
        };
        return colors[role as keyof typeof colors] || "bg-gray-500";
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) onEdit();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && window.confirm(`Are you sure you want to delete ${staff.name}?`)) {
            onDelete();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl flex">
            {/* Left Side - Profile Section */}
            <div className="w-1/3 bg-gradient-to-b from-blue-50 to-blue-100 p-6 flex flex-col items-center">
                <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
                        {staff.profileImage ? (
                            <img
                                src={staff.profileImage}
                                alt={staff.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-500" />
                            </div>
                        )}
                    </div>
                    <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-semibold text-white rounded-full ${getRoleBadgeColor(staff.role)}`}>
                        {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 text-center mb-1">{staff.name}</h3>

                <div className={`px-2 py-1 text-xs font-medium rounded-full mb-4 ${
                    staff.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {staff.isActive ? 'Active' : 'Inactive'}
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-2 mt-auto">
                    {onEdit && (
                        <button
                            onClick={handleEdit}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                    {!onEdit && !onDelete && (
                        <button
                            onClick={onClose}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            Close
                        </button>
                    )}
                </div>
            </div>

            {/* Right Side - Details Section */}
            <div className="w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Staff Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-sm text-gray-900">{staff.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-sm text-gray-900">{staff.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Hash className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">NIC</p>
                            <p className="text-sm text-gray-900">{staff.nic}</p>
                        </div>
                    </div>

                    {staff.memberId && (
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Member ID</p>
                                <p className="text-sm text-gray-900">{staff.memberId}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                            <p className="text-sm text-gray-900">{formatDate(staff.dateOfBirth)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Joined Date</p>
                            <p className="text-sm text-gray-900">{formatDate(staff.createdAt)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Home className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="text-sm text-gray-900">{staff.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffCard;