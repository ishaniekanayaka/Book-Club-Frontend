import React from "react";
import type { Staff } from "../../types/Staff";

interface StaffCardProps {
    staff: Staff;
    onClose: () => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, onClose }) => {
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

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Staff Details</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                    ×
                </button>
            </div>

            <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 mb-3">
                    {staff.profileImage ? (
                        <img
                            src={staff.profileImage}
                            alt={staff.name}
                            className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center border-4 border-gray-200">
                            <span className="text-2xl font-bold text-gray-600">
                                {staff.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <h4 className="text-xl font-bold text-gray-900">{staff.name}</h4>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold text-white rounded-full ${getRoleBadgeColor(staff.role)}`}>
                    {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <span className="text-sm text-gray-900">{staff.email}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <span className="text-sm text-gray-900">{staff.phone}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">NIC:</span>
                    <span className="text-sm text-gray-900">{staff.nic}</span>
                </div>

                {staff.memberId && (
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Member ID:</span>
                        <span className="text-sm text-gray-900">{staff.memberId}</span>
                    </div>
                )}

                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                    <span className="text-sm text-gray-900">{formatDate(staff.dateOfBirth)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Joined:</span>
                    <span className="text-sm text-gray-900">{formatDate(staff.createdAt)}</span>
                </div>

                <div className="pt-2">
                    <span className="text-sm font-medium text-gray-500">Address:</span>
                    <p className="text-sm text-gray-900 mt-1">{staff.address}</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        staff.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {staff.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StaffCard;