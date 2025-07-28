import React, { useEffect, useState } from "react"
import { useAuth } from "../context/useAuth"
import { updateUserProfile } from "../services/authService"
import { toast } from "react-hot-toast"
import ForgotPassword from "./ForgetPassword.tsx";


const Settings = () => {
    const { user, setUser } = useAuth()
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        profileImage: null as File | null,
    })
    const [showForgotPassword, setShowForgotPassword] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                address: user.address || "",
                dateOfBirth: user.dateOfBirth?.substring(0, 10) || "",
                profileImage: null,
            })
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData((prev) => ({ ...prev, profileImage: e.target.files![0] }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?._id) return toast.error("User ID not found")

        try {
            const updatedUser = await updateUserProfile(user._id, formData)
            setUser(updatedUser)
            toast.success("Profile updated successfully")
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update profile")
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 relative">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-700">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {user?.profileImage && (
                            <img
                                src={user.profileImage}
                                alt="Profile"
                                className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Change Password
                    </button>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Forgot Password Popup */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <ForgotPassword
                            onClose={() => setShowForgotPassword(false)}
                            email={user?.email || ""}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Settings