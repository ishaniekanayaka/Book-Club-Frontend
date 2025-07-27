import apiClient from "./apiClient";
import type { Staff } from "../types/Staff";

export const getAllStaff = async (): Promise<Staff[]> => {
    const response = await apiClient.get("/auth/staff");
    return response.data;
};

export const addStaff = async (data: FormData): Promise<Staff> => {
    const response = await apiClient.post("/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.user;
};

export const updateStaff = async (id: string, data: FormData): Promise<Staff> => {
    const response = await apiClient.put(`/auth/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.user;
};

export const updateStaffRole = async (id: string, role: string): Promise<Staff> => {
    const response = await apiClient.put(`/auth/role/${id}`, { role });
    return response.data.user;
};

export const deleteStaff = async (id: string): Promise<void> => {
    await apiClient.delete(`/auth/${id}`);
};
