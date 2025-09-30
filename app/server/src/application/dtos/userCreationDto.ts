import { UserRoles } from "../../domain/enums/userRoles";

export class UserCreationDto {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public role: UserRoles,
    ){}
    
}