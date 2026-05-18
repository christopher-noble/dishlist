export enum UserAccountStatus {
    ACTIVE = 'ACTIVE', 
    INACTIVE = 'INACTIVE',
    QUEUED = 'QUEUED'
}

export interface User {
    id: string;
    authUserId: string | null;
    firstName: string;
    lastName: string;
    primaryEmail: string;
    secondaryEmail: string | null;
    accountStatus: UserAccountStatus;
    createdAt: Date;
    updatedAt: Date;
}