// types/Book.ts

export type Book = {
    _id: string
    title: string
    author: string
    isbn: string
    publishedDate?: string // use string for ISO date
    genre?: string
    description?: string
    copiesAvailable: number
    backCover?: string
    isDeleted?: boolean
    createdAt: string
    updatedAt: string
}

export type BookFormData = {
    title: string
    author: string
    publishedDate?: string // use string for date input compatibility
    genre?: string
    description?: string
    copiesAvailable: number
    backCover?: File | string // Cloudinary file or URL
}
