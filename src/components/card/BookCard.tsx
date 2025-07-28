import React from "react"
import { Edit2, Trash2, BookOpen, User, Calendar, Hash, Eye, BookCopy } from "lucide-react"
import type { Book } from "../../types/Book"

type Props = {
    book: Book
    onEdit?: (book: Book) => void
    onDelete?: (id: string) => void
    onClick?: () => void
}

const BookCard: React.FC<Props> = ({ book, onEdit, onDelete, onClick }) => {
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onEdit) {
            onEdit(book)
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onDelete && window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
            onDelete(book._id)
        }
    }

    const isAvailable = book.copiesAvailable > 0
    const publishedYear = book.publishedDate ? new Date(book.publishedDate).getFullYear() : null

    return (
        <div
            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group ${
                onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
            }`}
            onClick={onClick}
        >
            {/* Book Cover */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                {book.backCover ? (
                    <img
                        src={book.backCover}
                        alt={`${book.title} cover`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                        }}
                    />
                ) : null}

                {/* Fallback when no image or image fails */}
                <div className={`absolute inset-0 flex items-center justify-center ${book.backCover ? 'hidden' : ''}`}>
                    <div className="text-center">
                        <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                        <p className="text-blue-600 text-sm font-medium">No Cover</p>
                    </div>
                </div>

                {/* Availability Badge */}
                <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {isAvailable ? 'Available' : 'Out of Stock'}
                    </span>
                </div>

                {/* Copies Count */}
                {isAvailable && (
                    <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                            <Hash className="w-3 h-3" />
                            {book.copiesAvailable}
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                {onClick && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                <BookCopy className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Book Details */}
            <div className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">
                    {book.title}
                </h3>

                {/* Author */}
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{book.author}</span>
                </div>

                {/* Genre and Published Year */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    {book.genre && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {book.genre}
                        </span>
                    )}
                    {publishedYear && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{publishedYear}</span>
                        </div>
                    )}
                </div>

                {/* Description Preview */}
                {book.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {book.description}
                    </p>
                )}

                {/* Availability Status */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                            {book.copiesAvailable} copies available
                        </span>
                    </div>
                    {onClick && isAvailable && (
                        <span className="text-xs text-blue-600 font-medium">Click to lend</span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {onEdit && (
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-1 flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                            title="Edit book details"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            title="Delete book"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    )}

                    {/* If no edit/delete buttons, show a view button */}
                    {!onEdit && !onDelete && onClick && (
                        <button
                            onClick={onClick}
                            className="flex items-center gap-1 w-full px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium justify-center"
                        >
                            <Eye className="w-4 h-4" />
                            View Details
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom stripe for visual appeal */}
            <div className={`h-1 ${
                isAvailable
                    ? 'bg-gradient-to-r from-green-400 to-blue-500'
                    : 'bg-gradient-to-r from-gray-300 to-gray-400'
            }`} />
        </div>
    )
}

export default BookCard