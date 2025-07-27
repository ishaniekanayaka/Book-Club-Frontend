import apiClient from "./apiClient";
import type { Staff } from "../types/Staff";

export const getAllStaff = async (): Promise<Staff[]> => {
    const response = await apiClient.get("/users/staff");
    return response.data;
};

export const addStaff = async (data: FormData): Promise<Staff> => {
    const response = await apiClient.post("/users/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.user;
};

export const updateStaff = async (id: string, data: FormData): Promise<Staff> => {
    const response = await apiClient.put(`/users/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.user;
};

export const updateStaffRole = async (id: string, role: string): Promise<Staff> => {
    const response = await apiClient.put(`/users/role/${id}`, { role });
    return response.data.user;
};

export const deleteStaff = async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};
