import { User } from "../dicebear/user";

export interface AuthenticationHookResult {
    userInfo: User | null;
    userRoles: string[];
}