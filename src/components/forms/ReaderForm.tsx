import React, { useEffect, useState } from "react"
import { User, CreditCard, Mail, Phone, Calendar, MapPin, UserPlus } from "lucide-react"
import type { Reader, ReaderFormData } from "../../types/Reader"

type Props = {
    reader?: Reader
    onSubmit: (data: ReaderFormData) => void
    onCancel?: () => void
    isLoading?: boolean
}

const ReaderForm: React.FC<Props> = ({ reader, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState<ReaderFormData>({
        fullName: "",
        nic: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
    })

    const [errors, setErrors] = useState<Partial<ReaderFormData>>({})

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
            })
        } else {
            setFormData({
                fullName: "",
                nic: "",
                email: "",
                phone: "",
                address: "",
                dateOfBirth: "",
            })
        }
        setErrors({})
    }, [reader])

    const validateForm = (): boolean => {
        const newErrors: Partial<ReaderFormData> = {}

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required"
        }

        if (!formData.nic.trim()) {
            newErrors.nic = "NIC is required"
        } else if (!/^(\d{9}[vVxX]|\d{12})$/.test(formData.nic)) {
            newErrors.nic = "Invalid NIC format"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number"
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required"
        } else {
            const birthDate = new Date(formData.dateOfBirth)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()

            if (age < 5 || age > 120) {
                newErrors.dateOfBirth = "Please enter a valid date of birth"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name as keyof ReaderFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        }
    }

    const handleReset = () => {
        setFormData({
            fullName: "",
            nic: "",
            email: "",
            phone: "",
            address: "",
            dateOfBirth: "",
        })
        setErrors({})
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    {reader ? "Edit Reader Details" : "Add New Reader"}
                </h2>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded hover:bg-gray-100"
                        disabled={isLoading}
                    >
                        ✕
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.fullName
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                            autoComplete="name"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    {/* NIC */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            NIC Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="nic"
                            type="text"
                            placeholder="Enter NIC number"
                            value={formData.nic}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.nic
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                            maxLength={12}
                        />
                        {errors.nic && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.nic}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Format: 123456789V or 123456789012
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.email
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            Phone Number
                        </label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.phone
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                            autoComplete="tel"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.phone}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Example: +94 77 123 4567
                        </p>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.dateOfBirth
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                            max={new Date().toISOString().split('T')[0]}
                            min="1900-01-01"
                        />
                        {errors.dateOfBirth && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.dateOfBirth}
                            </p>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        Address
                    </label>
                    <textarea
                        name="address"
                        placeholder="Enter full address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none hover:border-gray-400"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Optional: Street address, city, postal code
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                {reader ? "Update Reader" : "Add Reader"}
                            </>
                        )}
                    </button>

                    {!reader && (
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 font-medium"
                        >
                            Reset Form
                        </button>
                    )}

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 font-medium"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ReaderForm