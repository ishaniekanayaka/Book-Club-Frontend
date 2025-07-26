import React from "react"
import type { Book } from "../../types/Book"

type Props = {
    book: Book
    onEdit?: (book: Book) => void
    onDelete?: (id: string) => void
    onClick?: () => void
}

const BookCard: React.FC<Props> = ({ book, onEdit, onDelete, onClick }) => {
    return (
        <div
            className="bg-white shadow rounded-xl p-4 w-full max-w-sm cursor-pointer hover:shadow-md transition"
            onClick={onClick}
        >
            {book.backCover && (
                <img
                    src={book.backCover}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded"
                />
            )}
            <h2 className="text-xl font-semibold mt-2">{book.title}</h2>
            <p className="text-gray-600">Author: {book.author}</p>
            {book.genre && <p className="text-sm text-gray-500">Genre: {book.genre}</p>}
            {book.publishedDate && (
                <p className="text-sm text-gray-500">
                    Published: {new Date(book.publishedDate).toLocaleDateString()}
                </p>
            )}
            <p className="text-sm text-gray-500">Available: {book.copiesAvailable}</p>
            <div className="mt-4 flex gap-2">
                {onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(book)
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(book._id)
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    )
}

export default BookCard
