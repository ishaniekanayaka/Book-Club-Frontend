export type Reader = {
    _id: string;
    fullName: string;
    email: string;
};

export type Book = {
    _id: string;
    title: string;
    isbn?: string;
};

export type Lending = {
    _id: string;
    readerId: Reader | string;  // can be populated object or string ID
    bookId: Book | string;      // can be populated object or string ID
    lendDate: string;           // ISO string (from Date)
    dueDate: string;
    returnDate?: string;
    isReturned: boolean;
    fineAmount?: number;
    createdAt: string;
    updatedAt: string;
};

export type LendingFormData = {
    readerId: string;
    bookId: string;
    dueDate?: string;           // optional: use backend default if omitted
};
