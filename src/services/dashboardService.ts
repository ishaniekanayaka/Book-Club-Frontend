import apiClient from "./apiClient";

export const getTotalBooks = () => apiClient.get("/dash/total-books");
export const getTotalReaders = () => apiClient.get("/dash/total-readers");
export const getTotalStaff = () => apiClient.get("/dash/total-staff");
export const getTotalLibrarian = () => apiClient.get("/dash/total-librarian");
export const getActiveLendings = () => apiClient.get("/dash/active-lendings");
export const getOverdueBooks = () => apiClient.get("/dash/overdue-books");
export const getDashboardSummary = () => apiClient.get("/dash/all");
