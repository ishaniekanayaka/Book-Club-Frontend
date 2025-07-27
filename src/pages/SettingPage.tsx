import React, { useEffect, useState } from "react"
import { useAuth } from "../context/useAuth"
import { updateUserProfile } from "../services/authService"
import { toast } from "react-hot-toast"

const Settings = () => {
    const { user, setUser } = useAuth()
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        profileImage: null as File | null,
    })

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
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                    />
                    {user?.profileImage && (
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="mt-2 w-20 h-20 rounded-full object-cover"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    )
}

export default Settings
