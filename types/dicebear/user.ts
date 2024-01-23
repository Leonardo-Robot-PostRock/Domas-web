import { Role } from "./role";

export interface User {
    name?: string;
    profile_pic?: string;
    roles?: Role[];
}