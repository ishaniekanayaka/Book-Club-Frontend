import React, { useEffect, useState } from "react"
import type { Reader, ReaderFormData } from "../../types/Reader"

type Props = {
    reader?: Reader
    onSubmit: (data: ReaderFormData) => void
}

const ReaderForm: React.FC<Props> = ({ reader, onSubmit }) => {
    const [formData, setFormData] = useState<ReaderFormData>({
        fullName: "",
        nic: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        // profileImage removed
    })

    // Populate form when editing
    useEffect(() => {
        if (reader) {
            setFormData({
                fullName: reader.fullName,
                nic: reader.nic,
                email: reader.email,
                phone: reader.phone,
                address: reader.address,
                dateOfBirth: reader.dateOfBirth?.substring(0, 10) || "",
                // profileImage removed
            })
        }
    }, [reader])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData) // send JSON, no FormData
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="nic" placeholder="NIC" value={formData.nic} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
            <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2 border rounded" required />
            {/* No file input */}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {reader ? "Update Reader" : "Add Reader"}
            </button>
        </form>
    )
}

export default ReaderForm
