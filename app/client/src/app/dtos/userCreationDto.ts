import { UserRoles } from "../enums/userRoles";

export class UserCreationDto { 
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public role: UserRoles,
    ){}
}