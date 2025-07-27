import React from "react";
import type {Staff} from "../../types/Staff.ts";


interface Props {
    staff: Staff;
    onClose: () => void;
}

const StaffCard: React.FC<Props> = ({ staff, onClose }) => {
    return (
        <div className="border rounded shadow p-6 max-w-sm bg-white relative">
            <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={onClose}
            >
                ✕
            </button>
            <img
                src={staff.profileImage || "/default-profile.png"}
                alt={staff.name}
                className="w-32 h-32 object-cover rounded-full mx-auto"
            />
            <h2 className="text-xl font-bold mt-4 text-center">{staff.name}</h2>
            <p className="text-center text-gray-600">{staff.role}</p>
            <p><strong>Email:</strong> {staff.email}</p>
            <p><strong>Phone:</strong> {staff.phone || "-"}</p>
            <p><strong>Address:</strong> {staff.address || "-"}</p>
            <p><strong>Date of Birth:</strong> {staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString() : "-"}</p>
            <p><strong>NIC:</strong> {staff.nic || "-"}</p>
            <p><strong>Member ID:</strong> {staff.memberId || "-"}</p>
        </div>
    );
};

export default StaffCard;
