export interface User {
    id: number;
    userName: string;
    email: string;
    Password: string;
    role: string;
    createdAt: Date;
    isActive: boolean;
}