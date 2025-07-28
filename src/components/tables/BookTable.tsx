import React from "react"
import { Edit2, Trash2, BookOpen, User, Calendar, Hash, Tag } from "lucide-react"
import type { Book } from "../../types/Book"

type Props = {
    books: Book[]
    onEdit: (book: Book) => void
    onDelete: (id: string) => void
    isLoading?: boolean
}

const BooksTable: React.FC<Props> = ({ books, onEdit, onDelete, isLoading = false }) => {
    const handleDelete = (book: Book) => {
        if (window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
            onDelete(book._id)
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="ml-3 text-gray-600">Loading books...</span>
                </div>
            </div>
        )
    }

    if (books.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500">Start by adding your first book to the collection.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Author & Genre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Publication
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Availability
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => {
                        const isAvailable = book.copiesAvailable > 0
                        const publishedYear = book.publishedDate
                            ? new Date(book.publishedDate).getFullYear()
                            : null

                        return (
                            <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                                {/* Book Details */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-12 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded flex items-center justify-center flex-shrink-0 mr-4">
                                            {book.backCover ? (
                                                <img
                                                    src={book.backCover}
                                                    alt={`${book.title} cover`}
                                                    className="w-full h-full object-cover rounded"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.style.display = 'none'
                                                        target.nextElementSibling?.classList.remove('hidden')
                                                    }}
                                                />
                                            ) : null}
                                            <BookOpen className={`w-6 h-6 text-blue-400 ${book.backCover ? 'hidden' : ''}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={book.title}>
                                                {book.title}
                                            </div>
                                            {book.isbn && (
                                                <div className="text-xs text-gray-500 mt-1 flex items-center">
                                                    <Hash className="w-3 h-3 mr-1" />
                                                    {book.isbn}
                                                </div>
                                            )}
                                            {book.description && (
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {book.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Author & Genre */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 text-gray-400 mr-1" />
                                        <span className="text-sm text-gray-900">
                                                {book.author}
                                            </span>
                                    </div>
                                    {book.genre && (
                                        <div className="mt-2 flex items-center">
                                            <Tag className="w-4 h-4 text-gray-400 mr-1" />
                                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                                    {book.genre}
                                                </span>
                                        </div>
                                    )}
                                </td>

                                {/* Publication */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {publishedYear && (
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                                            <span className="text-sm text-gray-900">
                                                    {publishedYear}
                                                </span>
                                        </div>
                                    )}
                                </td>

                                {/* Availability */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            isAvailable
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {isAvailable
                                                ? `${book.copiesAvailable} available`
                                                : 'Out of stock'}
                                        </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => onEdit(book)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BooksTable