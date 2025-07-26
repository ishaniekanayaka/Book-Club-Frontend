import type { Reader } from "../types/Reader"
import apiClient from "./apiClient"

export const getAllReaders = async (): Promise<Reader[]> => {
    const response = await apiClient.get("/reader/all")
    return response.data
}

export const addReader = async (formData: FormData): Promise<Reader> => {
    const response = await apiClient.post("/reader/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.reader
}

export const updateReader = async (id: string, formData: FormData): Promise<Reader> => {
    const response = await apiClient.put(`/reader/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.updated
}

export const deleteReader = async (id: string): Promise<void> => {
    await apiClient.delete(`/reader/${id}`)
}

export const getReaderLogs = async (id: string): Promise<{
    message: string
    logs: {
        createdBy?: string
        createdAt?: string
        updatedBy?: string
        updatedAt?: string
        deletedBy?: string
        deletedAt?: string
    }
}> => {
    const response = await apiClient.get(`/reader/${id}/logs`)
    return response.data
}
