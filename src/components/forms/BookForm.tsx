import React, { useEffect, useState } from "react"
import type { BookFormData, Book } from "../../types/Book"

type Props = {
    book?: Book
    onSubmit: (data: FormData) => void
}

const BookForm: React.FC<Props> = ({ book, onSubmit }) => {
    const [formData, setFormData] = useState<BookFormData>({
        title: "",
        author: "",
        genre: "",
        description: "",
        publishedDate: "",
        copiesAvailable: 1,
        backCover: undefined,
    })

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
        }
    }, [book])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, copiesAvailable: Number(e.target.value) }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData((prev) => ({ ...prev, backCover: e.target.files![0] }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined) {
                if (typeof value === "number") {
                    data.append(key, value.toString()) // ✅ Convert number to string
                } else {
                    data.append(key, value)
                }
            }
        })

        onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="author" placeholder="Author" value={formData.author} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} className="w-full p-2 border rounded" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="number" name="copiesAvailable" min={1} value={formData.copiesAvailable} onChange={handleNumberChange} className="w-full p-2 border rounded" />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                {book ? "Update Book" : "Add Book"}
            </button>
        </form>
    )
}

export default BookForm
