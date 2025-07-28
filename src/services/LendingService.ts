
// services/LendingService.ts
import apiClient from "./apiClient";
import type { Lending } from "../types/Lending";

export const lendBook = async (identifier: { nic?: string; memberId?: string }, isbn: string) => {
    const res = await apiClient.post("/lending/lend", { ...identifier, isbn });
    return res.data;
};

export const getAllLendings = async (): Promise<Lending[]> => {
    const res = await apiClient.get("/lending/all");
    return res.data;
};

export const getOverdueLendings = async (): Promise<Lending[]> => {
    const res = await apiClient.get("/lending/overdue");
    return res.data.overdue;
};

export const returnBook = async (id: string): Promise<Lending> => {
    const res = await apiClient.put(`/lending/return/${id}`);
    return res.data;
};

export const getReturnedOverdueLendings = async () => {
    const res = await apiClient.get("/lending/returned");
    return res.data;
};

export const getLendingsByBook = async (isbn: string): Promise<Lending[]> => {
    const res = await apiClient.get(`/lending/book/${isbn}`);
    return res.data;
};

export const getLendingsByReader = async (readerId: string): Promise<Lending[]> => {
    const res = await apiClient.get(`/lending/reader/${readerId}`);
    return res.data;
};

export const sendOverdueNotifications = async () => {
    const res = await apiClient.post("/lending/notify-overdues");
    return res.data;
};