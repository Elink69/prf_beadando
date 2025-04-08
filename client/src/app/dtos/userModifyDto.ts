import { UserRoles } from "../enums/userRoles";

export class UserModifyDto {
    public constructor(
        public name: string,
        public email: string,
        public role: UserRoles,
        public password: string,
    ){}
}