// src/api/lendingApi.ts
import apiClient from "./apiClient";
import type {Lending} from "../types/Lending.ts";

export const lendBook = async (identifier: { nic?: string; memberId?: string }, isbn: string) => {
    const res = await apiClient.post("/lending/lend", { ...identifier, isbn });
    return res.data;
};

export const getAllLendings = async (): Promise<Lending[]> => {
    const res = await apiClient.get("/lending/all");
    return res.data;
};