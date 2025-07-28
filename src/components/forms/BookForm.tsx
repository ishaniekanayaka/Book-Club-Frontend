import React, { useEffect, useState } from "react"
import { BookOpen, User, Tag, Calendar, Hash, FileText, Image, Plus } from "lucide-react"
import type { BookFormData, Book } from "../../types/Book"

type Props = {
    book?: Book
    onSubmit: (data: FormData) => void
    onCancel?: () => void
    isLoading?: boolean
}

const BookForm: React.FC<Props> = ({ book, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState<BookFormData>({
        title: "",
        author: "",
        genre: "",
        description: "",
        publishedDate: "",
        copiesAvailable: 1,
        backCover: undefined,
    })

    const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({})
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // Populate form when editing
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                genre: book.genre || "",
                description: book.description || "",
                publishedDate: book.publishedDate?.substring(0, 10) || "",
                copiesAvailable: book.copiesAvailable,
                backCover: undefined,
            })
            if (book.backCover) {
                setImagePreview(book.backCover)
            }
        } else {
            setFormData({
                title: "",
                author: "",
                genre: "",
                description: "",
                publishedDate: "",
                copiesAvailable: 1,
                backCover: undefined,
            })
            setImagePreview(null)
        }
        setErrors({})
    }, [book])

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof BookFormData, string>> = {}

        if (!formData.title.trim()) {
            newErrors.title = "Book title is required"
        }

        if (!formData.author.trim()) {
            newErrors.author = "Author name is required"
        }

        if (formData.copiesAvailable < 1) {
            newErrors.copiesAvailable = "Number of copies must be at least 1"
        }

        if (formData.publishedDate) {
            const publishedDate = new Date(formData.publishedDate)
            const currentDate = new Date()

            if (publishedDate > currentDate) {
                newErrors.publishedDate = "Published date cannot be in the future"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name as keyof BookFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1
        setFormData(prev => ({ ...prev, copiesAvailable: Math.max(1, value) }))

        if (errors.copiesAvailable) {
            setErrors(prev => ({ ...prev, copiesAvailable: undefined }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, backCover: "Please select a valid image file" }))
                return
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, backCover: "Image size must be less than 5MB" }))
                return
            }

            setFormData(prev => ({ ...prev, backCover: file }))

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)

            // Clear any previous error
            if (errors.backCover) {
                setErrors(prev => ({ ...prev, backCover: undefined }))
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const data = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined) {
                if (typeof value === "number") {
                    data.append(key, value.toString())
                } else if (value instanceof File) {
                    data.append(key, value)
                } else if (typeof value === "string" && value.trim()) {
                    data.append(key, value.trim())
                }
            }
        })

        onSubmit(data)
    }

    const handleReset = () => {
        setFormData({
            title: "",
            author: "",
            genre: "",
            description: "",
            publishedDate: "",
            copiesAvailable: 1,
            backCover: undefined,
        })
        setImagePreview(null)
        setErrors({})
    }

    const removeImage = () => {
        setFormData(prev => ({ ...prev, backCover: undefined }))
        setImagePreview(null)
        if (errors.backCover) {
            setErrors(prev => ({ ...prev, backCover: undefined }))
        }
    }

    // Common genres for quick selection
    const commonGenres = [
        "Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction",
        "Fantasy", "Biography", "History", "Self-Help", "Educational",
        "Children's Books", "Poetry", "Drama", "Horror", "Adventure"
    ]

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    {book ? "Edit Book Details" : "Add New Book"}
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

            <div onSubmit={handleSubmit} className="space-y-6">
                {/* Title and Author Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            Book Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="title"
                            type="text"
                            placeholder="Enter book title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.title
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                            autoComplete="off"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Author <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="author"
                            type="text"
                            placeholder="Enter author name"
                            value={formData.author}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.author
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                            autoComplete="off"
                        />
                        {errors.author && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.author}
                            </p>
                        )}
                    </div>
                </div>

                {/* Genre and Published Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Tag className="w-4 h-4 text-blue-600" />
                            Genre
                        </label>
                        <input
                            name="genre"
                            type="text"
                            placeholder="Enter or select genre"
                            value={formData.genre}
                            onChange={handleChange}
                            list="genres"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                            disabled={isLoading}
                        />
                        <datalist id="genres">
                            {commonGenres.map(genre => (
                                <option key={genre} value={genre} />
                            ))}
                        </datalist>
                        <p className="text-xs text-gray-500 mt-1">
                            Start typing to see suggestions or enter custom genre
                        </p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            Published Date
                        </label>
                        <input
                            type="date"
                            name="publishedDate"
                            value={formData.publishedDate}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.publishedDate
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.publishedDate && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.publishedDate}
                            </p>
                        )}
                    </div>
                </div>

                {/* Copies Available */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Hash className="w-4 h-4 text-blue-600" />
                            Number of Copies <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="copiesAvailable"
                            min={1}
                            max={1000}
                            value={formData.copiesAvailable}
                            onChange={handleNumberChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.copiesAvailable
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            disabled={isLoading}
                        />
                        {errors.copiesAvailable && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span>
                                {errors.copiesAvailable}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Number of copies available for lending
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Enter book description or summary"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none hover:border-gray-400"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Optional: Brief description or summary of the book
                    </p>
                </div>

                {/* Book Cover Upload */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Image className="w-4 h-4 text-blue-600" />
                        Book Cover Image
                    </label>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                disabled={isLoading}
                            />
                            {errors.backCover && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <span className="text-red-500">⚠</span>
                                    {errors.backCover}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Optional: Upload book cover image (Max 5MB, JPG/PNG)
                            </p>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="lg:w-32">
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Book cover preview"
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                        disabled={isLoading}
                                        title="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleSubmit}
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
                                <Plus className="w-4 h-4" />
                                {book ? "Update Book" : "Add Book"}
                            </>
                        )}
                    </button>

                    {!book && (
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
            </div>
        </div>
    )
}

export default BookForm