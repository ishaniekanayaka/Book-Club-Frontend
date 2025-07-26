// types/Lending.ts

export type Lending = {
    _id: string
    readerId: string
    bookId: string
    lendDate: string           // ISO string (from Date)
    dueDate: string
    returnDate?: string
    isReturned: boolean
    fineAmount?: number
    createdAt: string
    updatedAt: string
}

export type LendingFormData = {
    readerId: string
    bookId: string
    dueDate?: string           // optional: use backend default if omitted
}
