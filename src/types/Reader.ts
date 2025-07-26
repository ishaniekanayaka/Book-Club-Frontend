export type Reader = {
    _id: string
    fullName: string
    nic: string
    email: string
    phone: string
    address: string
    dateOfBirth: string // or Date, depending on your handling
    profileImage?: string
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
    dateOfBirth: string // use ISO string for form compatibility
    profileImage?: File | string // if you're using Cloudinary/image upload
}
