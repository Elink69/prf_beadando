import { UserRoles } from "../../domain/enums/userRoles";

export class UserDetailsDto {
    constructor(
        public name: string,
        public email: string,
        public role: UserRoles,
        public creationDate: Date
    ){}
}