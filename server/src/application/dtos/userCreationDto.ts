import { AutoMap } from "@automapper/classes";
import { UserRoles } from "../../domain/enums/userRoles";

export class UserCreationDto {
    @AutoMap()
    public name: string;

    @AutoMap()
    public email: string;

    public password: string;

    @AutoMap(() => Number)
    public role: UserRoles;
}