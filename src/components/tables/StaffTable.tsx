import React from "react";
import type {Staff} from "../../types/Staff.ts";


interface Props {
    staffList: Staff[];
    onSelect: (staff: Staff) => void;
}

const StaffTable: React.FC<Props> = ({ staffList, onSelect }) => {
    return (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
            <tr>
                <th className="border border-gray-300 px-4 py-2">Member ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
            </tr>
            </thead>
            <tbody>
            {staffList.map((staff) => (
                <tr
                    key={staff._id}
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => onSelect(staff)}
                >
                    <td className="border border-gray-300 px-4 py-2">{staff.memberId}</td>
                    <td className="border border-gray-300 px-4 py-2">{staff.name}</td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">{staff.role}</td>
                    <td className="border border-gray-300 px-4 py-2">{staff.email}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default StaffTable;
