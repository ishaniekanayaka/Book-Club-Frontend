import apiClient from "./apiClient"
import type { AuditLog } from "../types/AuditLog"

export const getAllAuditLogs = async (): Promise<AuditLog[]> => {
    const response = await apiClient.get("/audit/all")
    return response.data
}
