import { UserRoles } from "../enums/userRoles";

export class UserDetailsDto {
    public constructor(
        public name: string,
        public email: string,
        public role: UserRoles,
        public visibleRole: string | undefined,
        public creationDate: Date,
    ){}
}