import { UserRoles } from "../enums/userRoles";

export class UserDto {
    constructor(
        public name: string,
        public email: string,
        public role: UserRoles
    ){}
}
