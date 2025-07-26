import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import type { Book } from "../types/Book"
import { addBook, deleteBook, getAllBooks, updateBook } from "../services/BookService"
import BookForm from "../components/forms/BookForm"
import BookCard from "../components/card/BookCard"

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [editingBook, setEditingBook] = useState<Book | null>(null)
    const [titleFilter, setTitleFilter] = useState("")
    const [genreFilter, setGenreFilter] = useState("")
    const [isbnFilter, setIsbnFilter] = useState("")

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
    }, [titleFilter, genreFilter, isbnFilter]) // 🔁 Re-fetch when any filter changes

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

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {books.map((book) => (
                    <BookCard
                        key={book._id}
                        book={book}
                        onEdit={setEditingBook}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    )
}

export default BooksPage
