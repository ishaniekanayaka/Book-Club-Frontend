import React, { useEffect, useState } from "react";
import { getAllStaff, addStaff, updateStaff, deleteStaff, updateStaffRole, searchUsers } from "../services/staffService";
import type { Staff } from "../types/Staff";
import StaffTable from "../components/tables/StaffTable";
import StaffCard from "../components/card/StaffCard";
import StaffForm from "../components/forms/StaffForm";

const StaffManagement: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editStaff, setEditStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const data = await getAllStaff();
            setStaffList(data);
            setFilteredStaff(data);
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to fetch staff");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredStaff(staffList);
        } else {
            const filtered = staffList.filter(staff =>
                staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (staff.nic && staff.nic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (staff.memberId && staff.memberId.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredStaff(filtered);
        }
    }, [searchQuery, staffList]);

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
        if (!selectedStaff) return alert("Select a staff member to delete");

        const confirmMessage = `Are you sure you want to deactivate ${selectedStaff.name}? This action will set their status to inactive.`;
        if (!window.confirm(confirmMessage)) return;

        try {
            await deleteStaff(selectedStaff._id);
            alert("Staff member deactivated successfully");
            setSelectedStaff(null);
            fetchStaff();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to deactivate staff member");
        }
    };

    const handleFormSubmit = async (formData: FormData) => {
        try {
            if (editStaff) {
                await updateStaff(editStaff._id, formData);
                alert("Staff updated successfully");
            } else {
                await addStaff(formData);
                alert("Staff added successfully");
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
        if (selectedStaff.role === role) return alert("Staff already has this role");

        const confirmMessage = `Are you sure you want to change ${selectedStaff.name}'s role to ${role}?`;
        if (!window.confirm(confirmMessage)) return;

        try {
            await updateStaffRole(selectedStaff._id, role);
            alert("Role updated successfully");
            setSelectedStaff(null);
            fetchStaff();
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to update role");
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            setFilteredStaff(staffList);
            return;
        }

        try {
            setLoading(true);
            const results = await searchUsers(searchQuery);
            const staffResults = results.filter(user =>
                ["admin", "staff", "librarian"].includes(user.role)
            );
            setFilteredStaff(staffResults);
        } catch (error: any) {
            alert(error?.response?.data?.message || "Search failed");
            setFilteredStaff([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setSearchQuery("");
        setSelectedStaff(null);
        fetchStaff();
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-600 mt-1">Manage your library staff members</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={handleAddClick}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                        Add Staff
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name, email, NIC, or member ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setFilteredStaff(staffList);
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-blue-600">{staffList.length}</div>
                    <div className="text-gray-600">Total Staff</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-green-600">
                        {staffList.filter(s => s.role === 'librarian').length}
                    </div>
                    <div className="text-gray-600">Librarians</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-purple-600">
                        {staffList.filter(s => s.role === 'staff').length}
                    </div>
                    <div className="text-gray-600">Staff Members</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-2xl font-bold text-orange-600">
                        {filteredStaff.length}
                    </div>
                    <div className="text-gray-600">Showing Results</div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <StaffTable
                        staffList={filteredStaff}
                        onSelect={handleSelectStaff}
                        selectedStaffId={selectedStaff?._id || null}
                    />

                    {selectedStaff && (
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <StaffCard
                                    staff={selectedStaff}
                                    onClose={() => setSelectedStaff(null)}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white rounded-lg shadow-md p-4">
                                    <h3 className="text-lg font-semibold mb-4">Actions</h3>

                                    <button
                                        onClick={handleEditClick}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-2"
                                    >
                                        Edit Staff
                                    </button>

                                    <button
                                        onClick={handleDeleteClick}
                                        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors mb-4"
                                    >
                                        Deactivate Staff
                                    </button>

                                    <div>
                                        <label className="block font-semibold mb-2 text-gray-700">
                                            Change Role:
                                        </label>
                                        <select
                                            value={selectedStaff.role}
                                            onChange={(e) => handleRoleChange(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="staff">Staff</option>
                                            <option value="librarian">Librarian</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Form Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <StaffForm
                                initialData={editStaff || undefined}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setFormOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;