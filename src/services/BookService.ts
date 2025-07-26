import axios from "axios";
import type {Book} from "../types/Book.ts";


const BASE_URL = "/api/books";

export const getAllBooks = () => axios.get<Book[]>(BASE_URL);
export const createBook = (data: FormData) => axios.post(BASE_URL, data);
export const updateBook = (id: string, data: FormData) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteBook = (id: string) => axios.delete(`${BASE_URL}/${id}`);
export const getGenres = () => axios.get<string[]>(`${BASE_URL}/genres/list`);
