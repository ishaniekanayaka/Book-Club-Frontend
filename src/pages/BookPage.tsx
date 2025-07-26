import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

import type { Book } from "../types/Book"
import {addBook, deleteBook, getAllBooks, updateBook} from "../services/BookService"
import BookForm from "../components/forms/BookForm.tsx";
import BookCard from "../components/card/BookCard.tsx";


const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [editingBook, setEditingBook] = useState<Book | null>(null)

    const fetchBooks = async () => {
        try {
            const res = await getAllBooks()
            setBooks(res)
        } catch (err) {
            toast.error("Failed to load books.")
        }
    }

    useEffect(() => {
        fetchBooks()
    }, [])

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

            {/* Form */}
            <div className="mb-8">
                <BookForm book={editingBook!} onSubmit={handleSubmit} />
            </div>

            {/* Cards Grid */}
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
