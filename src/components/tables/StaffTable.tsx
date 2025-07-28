import React from "react";
import type { Staff } from "../../types/Staff";

interface StaffTableProps {
    staffList: Staff[];
    onSelect: (staff: Staff) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({ staffList, onSelect }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getRoleBadge = (role: string) => {
        const colors = {
            admin: "bg-purple-100 text-purple-800",
            staff: "bg-blue-100 text-blue-800",
            librarian: "bg-green-100 text-green-800",
        };
        return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Staff Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            NIC
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Member ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined Date
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {staffList.map((staff) => (
                        <tr
                            key={staff._id}
                            onClick={() => onSelect(staff)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {staff.profileImage ? (
                                            <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={staff.profileImage}
                                                alt={staff.name}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {staff.name.charAt(0).toUpperCase()}
                                                    </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {staff.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {staff.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(staff.role)}`}>
                                        {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{staff.phone}</div>
                                <div className="text-sm text-gray-500 truncate max-w-32">
                                    {staff.address}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {staff.nic}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {staff.memberId || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(staff.createdAt)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {staffList.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No staff members found</p>
                </div>
            )}
        </div>
    );
};

export default StaffTable;