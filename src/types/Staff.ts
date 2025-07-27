export interface Staff {
    _id: string;
    name: string;
    email: string;
    role: "staff" | "librarian";
    phone?: string;
    address?: string;
    dateOfBirth?: string; // ISO string
    profileImage?: string;
    isActive: boolean;
    memberId?: string;
    nic?: string;
    createdAt?: string;
}
