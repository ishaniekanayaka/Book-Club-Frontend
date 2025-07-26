import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import type { Book } from "../types/Book"
import { addBook, deleteBook, getAllBooks, updateBook } from "../services/BookService"
import BookForm from "../components/forms/BookForm"
import BookCard from "../components/card/BookCard"
import { lendBook } from "../services/LendingService"

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [editingBook, setEditingBook] = useState<Book | null>(null)
    const [titleFilter, setTitleFilter] = useState("")
    const [genreFilter, setGenreFilter] = useState("")
    const [isbnFilter, setIsbnFilter] = useState("")
    const [lendingBook, setLendingBook] = useState<Book | null>(null)
    const [nicInput, setNicInput] = useState("")

    const fetchBooks = async () => {
        try {
            const res = await getAllBooks({
                title: titleFilter || undefined,
                genre: genreFilter || undefined,
                isbn: isbnFilter || undefined,
            })
            setBooks(res)
        } catch (err) {
            toast.error("Failed to load books.")
        }
    }

    useEffect(() => {
        fetchBooks()
    }, [titleFilter, genreFilter, isbnFilter])

    const handleSubmit = async (data: FormData) => {
        try {
            if (editingBook) {
                await updateBook(editingBook._id, data)
                toast.success("Book updated!")
            } else {
                await addBook(data)
                toast.success("Book added!")
            }
            fetchBooks()
            setEditingBook(null)
        } catch (err) {
            toast.error("Failed to save book.")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteBook(id)
            toast.success("Book deleted!")
            fetchBooks()
        } catch (err) {
            toast.error("Failed to delete book.")
        }
    }

    const handleLend = async () => {
        if (!nicInput || !lendingBook) return toast.error("NIC is required.")
        try {
            await lendBook(nicInput.trim(), lendingBook.isbn)
            toast.success("Book lent successfully.")
            setLendingBook(null)
            setNicInput("")
            fetchBooks()
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lending failed.")
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Books</h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Title"
                    className="border p-2 rounded"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Genre"
                    className="border p-2 rounded"
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by ISBN"
                    className="border p-2 rounded"
                    value={isbnFilter}
                    onChange={(e) => setIsbnFilter(e.target.value)}
                />
            </div>

            {/* Form */}
            <div className="mb-8">
                <BookForm book={editingBook!} onSubmit={handleSubmit} />
            </div>

            {/* Lending Modal */}
            {lendingBook && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-2">Lend "{lendingBook.title}"</h2>
                        <input
                            type="text"
                            placeholder="Enter Member NIC"
                            className="w-full p-2 border rounded mb-4"
                            value={nicInput}
                            onChange={(e) => setNicInput(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setLendingBook(null)
                                    setNicInput("")
                                }}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLend}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Lend
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {books.map((book) => (
                    <BookCard
                        key={book._id}
                        book={book}
                        onEdit={setEditingBook}
                        onDelete={handleDelete}
                        onClick={() => setLendingBook(book)}
                    />
                ))}
            </div>
        </div>
    )
}

export default BooksPage
