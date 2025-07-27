import React, { useState} from "react";
import type {Staff} from "../../types/Staff.ts";


interface Props {
    initialData?: Staff;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
}

const StaffForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [role, setRole] = useState<"staff" | "librarian">(initialData?.role || "staff");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [address, setAddress] = useState(initialData?.address || "");
    const [dateOfBirth, setDateOfBirth] = useState(
        initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().slice(0, 10) : ""
    );
    const [nic, setNic] = useState(initialData?.nic || "");
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("role", role);
        if (phone) formData.append("phone", phone);
        if (address) formData.append("address", address);
        if (dateOfBirth) formData.append("dateOfBirth", dateOfBirth);
        if (nic) formData.append("nic", nic);
        if (profileImageFile) formData.append("profileImage", profileImageFile);

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 border rounded shadow bg-white">
            <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    type="text"
                    minLength={3}
                />
            </div>

            {!initialData && (
                <div>
                    <label className="block mb-1 font-semibold">Email</label>
                    <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        type="email"
                    />
                </div>
            )}

            <div>
                <label className="block mb-1 font-semibold">Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "staff" | "librarian")}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    disabled={!!initialData} // disable changing role on update for simplicity
                >
                    <option value="staff">Staff</option>
                    <option value="librarian">Librarian</option>
                </select>
            </div>

            <div>
                <label className="block mb-1 font-semibold">Phone</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    type="tel"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Address</label>
                <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    type="text"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Date of Birth</label>
                <input
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    type="date"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">NIC</label>
                <input
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    type="text"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Profile Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImageFile(e.target.files ? e.target.files[0] : null)}
                />
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    {initialData ? "Update Staff" : "Add Staff"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default StaffForm;
