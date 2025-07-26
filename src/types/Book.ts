export type Book = {
    _id?: string;
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    genre?: string;
    description?: string;
    copiesAvailable: number;
    backCover?: string;
};

export type BookFormData = {
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    genre?: string;
    description?: string;
    copiesAvailable: number;
    backCover?: File | undefined;
};