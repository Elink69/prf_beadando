import { AutoMap } from "@automapper/classes";
import { UserRoles } from "../../domain/enums/userRoles";

export class UserDetailsDto {
    @AutoMap()
    public name: string;

    @AutoMap()
    public email: string;

    @AutoMap(() => Number)
    public role: UserRoles;

    @AutoMap()
    public creationDate: Date;
}