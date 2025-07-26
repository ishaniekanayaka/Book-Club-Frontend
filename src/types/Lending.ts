import type {Reader} from "./Reader.ts";
import type {Book} from "./Book.ts";


export type Lending = {
    _id: string;
    readerId: Reader; // populated
    bookId: Book;     // populated
    lendDate: string;
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
    dueDate?: string;
};
