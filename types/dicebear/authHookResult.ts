import { User } from "./user";

export interface AuthenticationHookResult {
    userInfo: User | null;
    userRoles: string[];
}