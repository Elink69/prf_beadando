import { createMapper, createMap, forMember, typeConverter, mapFrom, ignore } from "@automapper/core";
import { classes } from "@automapper/classes";
import { UserDetailsDto } from "../dtos/userDetailsDto";
import { User } from "../../domain/entities/user"
import { UserCreationDto } from "../dtos/userCreationDto";

export const mapper = createMapper({
    strategyInitializer: classes(),
});

export const createMaps = () => {
    createMap(mapper, User, UserDetailsDto,
        forMember((dest) => dest.creationDate, mapFrom((src) => src.createdOn))
    );
    createMap(mapper, UserCreationDto, User,
        forMember((dest) => dest.createdOn, ignore())
    );
}