export interface Staff {
    _id: string
    name: string
    email: string
    role: "admin" | "staff" | "librarian" | "reader"
    phone: string
    address: string
    dateOfBirth: string
    nic: string
    profileImage?: string
    memberId?: string
    isActive: boolean
    createdAt: string
    updatedAt?: string
}

export interface StaffFormData {
    name: string
    email: string
    password: string
    role: "staff" | "librarian"
    phone: string
    address: string
    dateOfBirth: string
    nic: string
    profileImage?: File
}