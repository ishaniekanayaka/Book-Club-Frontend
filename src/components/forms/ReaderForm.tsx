import React, { useState } from "react"
import type { Reader, ReaderFormData } from "../../types/Reader"

type Props = {
    reader?: Reader
    onSubmit: (data: FormData) => void
}

const ReaderForm: React.FC<Props> = ({ reader, onSubmit }) => {
    const [formData, setFormData] = useState<ReaderFormData>({
        fullName: reader?.fullName || "",
        nic: reader?.nic || "",
        email: reader?.email || "",
        phone: reader?.phone || "",
        address: reader?.address || "",
        dateOfBirth: reader?.dateOfBirth?.substring(0, 10) || "",
        profileImage: undefined, // ✅ Use undefined instead of null
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData((prev) => ({ ...prev, profileImage: e.target.files![0] }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined) {
                data.append(key, value)
            }
        })
        onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="nic" placeholder="NIC" value={formData.nic} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
            <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        </form>
    )
}

export default ReaderForm
