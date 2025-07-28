/*
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
*/
// types/Lending.ts
export interface Lending {
    _id: string;
    readerId: {
        _id: string;
        fullName: string;
        memberId: string;
        nic: string;
        email: string;
    };
    bookId: {
        _id: string;
        title: string;
        isbn: string;
        author: string;
    };
    lendDate: string;
    dueDate: string;
    returnDate?: string;
    isReturned: boolean;
    isOverdue: boolean;
    fineAmount?: number;
    lentBy: string;
    returnedBy?: string;
    notes?: string;
}
