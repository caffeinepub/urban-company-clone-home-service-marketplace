import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfileResponse {
    principal: Principal;
    referralCode: string;
    blocked: boolean;
    createdAt: Time;
    role: UserRole;
    savedAddresses: Array<Address>;
    email: string;
    updatedAt: Time;
    phone: string;
    lastName: string;
    walletBalance: bigint;
    firstName: string;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type Time = bigint;
export interface Address {
    id: bigint;
    zip: string;
    city: string;
    userId: Principal;
    name: string;
    state: string;
    addressLine1: string;
    addressLine2: string;
    isDefault: boolean;
    phone: string;
}
export interface Service {
    id: bigint;
    categoryId: bigint;
    duration: bigint;
    active: boolean;
    name: string;
    description: string;
    imageUrl: string;
    price: bigint;
}
export interface UserProfile {
    principal: Principal;
    referralCode: string;
    blocked: boolean;
    createdAt: Time;
    role: UserRole;
    savedAddresses: Array<Address>;
    email: string;
    updatedAt: Time;
    phone: string;
    lastName: string;
    walletBalance: bigint;
    firstName: string;
}
export interface ServiceCategory {
    id: bigint;
    order: bigint;
    name: string;
    iconUrl: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Creates a new service category. Admin only.
     */
    createCategory(name: string, iconUrl: string): Promise<bigint>;
    /**
     * / Creates a new service. Admin only.
     */
    createService(categoryId: bigint, name: string, description: string, price: bigint, duration: bigint, imageUrl: string): Promise<bigint>;
    /**
     * / Deletes one of the calling user's saved addresses.
     */
    deleteAddress(addressId: bigint): Promise<void>;
    /**
     * / Deletes a service. Admin only.
     */
    deleteService(serviceId: bigint): Promise<void>;
    /**
     * / Returns active services for a category. Readable by everyone.
     */
    getActiveServicesByCategory(categoryId: bigint): Promise<Array<Service>>;
    /**
     * / Returns the profile of the calling user.
     */
    getCallerUserProfile(): Promise<UserProfileResponse | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Returns each category paired with its active services. Readable by everyone.
     */
    getCategoryWithServices(): Promise<Array<[ServiceCategory, Array<Service>]>>;
    /**
     * / Returns details of a single service. Readable by everyone.
     */
    getServiceDetails(serviceId: bigint): Promise<Service | null>;
    /**
     * / Returns the first `limit` categories. Readable by everyone.
     */
    getTopActiveCategories(limit: bigint): Promise<Array<ServiceCategory>>;
    /**
     * / Returns the profile of any user. Callers may only view their own profile
     * / unless they are an admin.
     */
    getUserProfile(user: Principal): Promise<UserProfileResponse | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    /**
     * / Returns all saved addresses for the calling user.
     */
    listAddresses(): Promise<Array<Address>>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    /**
     * / Lists all service categories. Readable by everyone.
     */
    listCategories(): Promise<Array<ServiceCategory>>;
    /**
     * / Lists active services for a given category. Readable by everyone.
     */
    listServicesByCategory(categoryId: bigint): Promise<Array<Service>>;
    requestApproval(): Promise<void>;
    /**
     * / Adds a new address to the calling user's saved addresses.
     */
    saveAddress(newAddress: Address): Promise<void>;
    /**
     * / Saves (creates or updates) the profile of the calling user.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    /**
     * / Marks one of the calling user's addresses as the default.
     */
    setDefaultAddress(addressId: bigint): Promise<void>;
    /**
     * / Updates the display order of a category. Admin only.
     */
    updateCategoryOrder(categoryId: bigint, newOrder: bigint): Promise<void>;
    /**
     * / Updates an existing service. Admin only.
     */
    updateService(serviceId: bigint, name: string | null, description: string | null, price: bigint | null, duration: bigint | null, imageUrl: string | null, active: boolean | null): Promise<void>;
}
