import React from "react"
import type { Book } from "../../types/Book"

type Props = {
    books: Book[]
    onEdit: (book: Book) => void
    onDelete: (id: string) => void
}

const BooksTable: React.FC<Props> = ({ books, onEdit, onDelete }) => {
    return (
        <table className="min-w-full border mt-4">
            <thead className="bg-gray-100">
            <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Author</th>
                <th className="p-2 border">Genre</th>
                <th className="p-2 border">Published Date</th>
                <th className="p-2 border">Copies</th>
                <th className="p-2 border">Actions</th>
            </tr>
            </thead>
            <tbody>
            {books.map((book) => (
                <tr key={book._id} className="text-center">
                    <td className="p-2 border">{book.title}</td>
                    <td className="p-2 border">{book.author}</td>
                    <td className="p-2 border">{book.genre || "-"}</td>
                    <td className="p-2 border">
                        {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-2 border">{book.copiesAvailable}</td>
                    <td className="p-2 border space-x-2">
                        <button
                            onClick={() => onEdit(book)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(book._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Delete
                 -       </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default BooksTable
