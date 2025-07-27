import type { Book } from "../types/Book"
import apiClient from "./apiClient"

// ✅ Get all non-deleted books
/*export const getAllBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get("/book")
    return response.data
}*/

// ✅ Add a new book
export const addBook = async (formData: FormData): Promise<Book> => {
    const response = await apiClient.post("/book", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.book
}

// ✅ Update an existing book
export const updateBook = async (id: string, formData: FormData): Promise<Book> => {
    const response = await apiClient.put(`/book/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.updated
}

// ✅ Soft delete a book
export const deleteBook = async (id: string): Promise<void> => {
    await apiClient.delete(`/book/${id}`)
}

// ✅ Get a single book by ID
export const getBookById = async (id: string): Promise<Book> => {
    const response = await apiClient.get(`/book/${id}`)
    return response.data
}

export const getGenres = async (): Promise<string[]> => {
    const response = await apiClient.get("/book/genres/list")
    return response.data.genres // 🛠️ fixed response to return .genres specifically
}


export const getAllBooks = async (filters?: { title?: string; genre?: string; isbn?: string }): Promise<Book[]> => {
    const response = await apiClient.get("/book", {
        params: filters,
    })
    return response.data
}

