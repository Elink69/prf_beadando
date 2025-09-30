import { UserRoles } from "../../domain/enums/userRoles";

export class UserModifyDto {
    public constructor(
        public name: string,
        public email: string,
        public role: UserRoles,
        public password: string,
    ){}
}