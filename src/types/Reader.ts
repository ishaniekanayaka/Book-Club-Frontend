export type Reader = {
    _id: string
    fullName: string
    nic: string
    email: string
    phone: string
    address: string
    dateOfBirth: string
    isActive: boolean
    createdAt: string
    memberId: string
    createdBy?: string
    updatedBy?: string
    updatedAt?: string
    deletedBy?: string
    deletedAt?: string
}

export type ReaderFormData = {
    fullName: string
    nic: string
    email: string
    phone: string
    address: string
    dateOfBirth: string
    // profileImage removed
}
