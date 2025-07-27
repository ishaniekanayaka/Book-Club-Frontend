import type { Reader, ReaderFormData } from "../types/Reader"
import apiClient from "./apiClient"

const BASE_URL = "/reader"

export const getAllReaders = async (): Promise<Reader[]> => {
    const response = await apiClient.get(`${BASE_URL}/all`)
    return response.data
}

export const addReader = async (data: ReaderFormData): Promise<Reader> => {
    const response = await apiClient.post(`${BASE_URL}/add`, data) // send JSON, not FormData
    return response.data.reader
}

export const updateReader = async (id: string, data: ReaderFormData): Promise<Reader> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data) // send JSON, not FormData
    return response.data.updated
}

export const deleteReader = async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`)
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
    const response = await apiClient.get(`${BASE_URL}/${id}/logs`)
    return response.data
}

export const searchReader = async (query: string): Promise<Reader | null> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/search/${query}`)
        return response.data
    } catch {
        return null
    }
}
