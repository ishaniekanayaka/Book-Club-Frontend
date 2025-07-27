import React, { useEffect, useState } from "react";
import { getAllStaff, addStaff, updateStaff, deleteStaff, updateStaffRole } from "../services/staffService";
import type { Staff } from "../types/Staff";
import StaffTable from "../components/tables/StaffTable.tsx";
import StaffCard from "../components/card/StaffCard.tsx";
import StaffForm from "../components/forms/StaffForm.tsx";


const StaffManagement: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editStaff, setEditStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const data = await getAllStaff();
            setStaffList(data);
        } catch (error) {
            alert("Failed to fetch staff");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSelectStaff = (staff: Staff) => {
        setSelectedStaff(staff);
    };

    const handleAddClick = () => {
        setEditStaff(null);
        setFormOpen(true);
    };

    const handleEditClick = () => {
        if (selectedStaff) {
            setEditStaff(selectedStaff);
            setFormOpen(true);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedStaff) return alert("Select a staff to delete");
        if (!window.confirm("Are you sure to delete this staff?")) return;

        try {
            await deleteStaff(selectedStaff._id);
            alert("Deleted successfully");
            setSelectedStaff(null);
            fetchStaff();
        } catch (error) {
            alert("Failed to delete staff");
        }
    };

    const handleFormSubmit = async (formData: FormData) => {
        try {
            if (editStaff) {
                await updateStaff(editStaff._id, formData);
                alert("Updated successfully");
            } else {
                await addStaff(formData);
                alert("Added successfully");
            }
            setFormOpen(false);
            setSelectedStaff(null);
            fetchStaff();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Error submitting form");
        }
    };

    const handleRoleChange = async (role: string) => {
        if (!selectedStaff) return alert("Select staff first");
        if (!["staff", "librarian"].includes(role)) return alert("Invalid role");

        try {
            await updateStaffRole(selectedStaff._id, role);
            alert("Role updated");
            fetchStaff();
        } catch (error) {
            alert("Failed to update role");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-bold">Staff Management</h1>
                <button
                    onClick={handleAddClick}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add Staff
                </button>
            </div>

            {loading ? (
                <p>Loading staff...</p>
            ) : (
                <>
                    <StaffTable staffList={staffList} onSelect={handleSelectStaff} />

                    {selectedStaff && (
                        <div className="mt-6 flex gap-4">
                            <StaffCard staff={selectedStaff} onClose={() => setSelectedStaff(null)} />

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleEditClick}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Edit Staff
                                </button>

                                <button
                                    onClick={handleDeleteClick}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Delete Staff
                                </button>

                                <div>
                                    <label className="block font-semibold mb-1">Change Role:</label>
                                    <select
                                        value={selectedStaff.role}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="librarian">Librarian</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {formOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
                    <div className="bg-white rounded p-6 max-w-md w-full">
                        <StaffForm
                            initialData={editStaff || undefined}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setFormOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
