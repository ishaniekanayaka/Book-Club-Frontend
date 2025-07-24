export interface Otp {
    email: string;
    otp: string;
    createdAt?: string;
    expiresAt?: string;
    verified?: boolean;
}
