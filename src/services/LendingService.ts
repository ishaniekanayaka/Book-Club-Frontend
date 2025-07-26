import apiClient from "./apiClient"

export const lendBook = async (nic: string, isbn: string): Promise<any> => {
    const response = await apiClient.post("/lending/lend", { nic, isbn })
    return response.data
}
