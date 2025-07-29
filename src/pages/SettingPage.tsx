import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { updateUserProfile } from "../services/authService";
import { toast } from "react-hot-toast";
import ForgotPassword from "./ForgetPassword";
import { FiEdit, FiLock, FiUser, FiCamera } from "react-icons/fi";

const Settings = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        profileImage: null as File | null,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                address: user.address || "",
                dateOfBirth: user.dateOfBirth?.substring(0, 10) || "",
                profileImage: null,
            });
            setPreviewImage(user.profileImage || null);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, profileImage: file }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id) return toast.error("User ID not found");

        try {
            const updatedUser = await updateUserProfile(user._id, formData);
            setUser(updatedUser);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                address: user.address || "",
                dateOfBirth: user.dateOfBirth?.substring(0, 10) || "",
                profileImage: null,
            });
            setPreviewImage(user.profileImage || null);
        }
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Account Settings</h1>
                            <p className="text-blue-100">Manage your personal information and security</p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <FiEdit className="w-5 h-5" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Profile Picture Section */}
                            <div className="md:w-1/3 flex flex-col items-center">
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <FiUser className="w-16 h-16 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-200">
                                            <FiCamera className="w-5 h-5" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {user?.name || "User Name"}
                                    </h3>
                                    <p className="text-gray-600">{user?.email || "user@example.com"}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Member since {new Date(user?.createdAt || "").toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="md:w-2/3 space-y-6">
                                {/* Personal Information Section */}
                                <div className="bg-gray-50 p-5 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiUser className="text-blue-600" />
                                        Personal Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900 bg-gray-100 p-2 rounded-lg">
                                                    {user?.name || "Not provided"}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900 bg-gray-100 p-2 rounded-lg">
                                                    {user?.phone || "Not provided"}
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address
                                            </label>
                                            {isEditing ? (
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    rows={2}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900 bg-gray-100 p-2 rounded-lg">
                                                    {user?.address || "Not provided"}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date of Birth
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900 bg-gray-100 p-2 rounded-lg">
                                                    {user?.dateOfBirth
                                                        ? new Date(user.dateOfBirth).toLocaleDateString()
                                                        : "Not provided"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Security Section */}
                                <div className="bg-gray-50 p-5 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiLock className="text-blue-600" />
                                        Security
                                    </h3>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Password</h4>
                                            <p className="text-sm text-gray-600">
                                                Last changed {new Date().toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                                        >
                                            <FiLock className="w-4 h-4" />
                                            Change Password
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex justify-end gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-fade-in">
                        <ForgotPassword
                            onClose={() => setShowForgotPassword(false)}
                            email={user?.email || ""}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;