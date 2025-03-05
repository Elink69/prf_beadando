import { createMapper, createMap, forMember, typeConverter, mapFrom, ignore, condition } from "@automapper/core";
import { classes } from "@automapper/classes";
import { UserDetailsDto } from "../dtos/userDetailsDto";
import { User } from "../../domain/entities/user"
import { UserCreationDto } from "../dtos/userCreationDto";
import { CourseCreationDto } from "../dtos/courseCreationDto";
import { Course } from "../../domain/entities/course";
import { CourseDetailsDto } from "../dtos/courseDetailsDto";
import { CourseModifyDto } from "../dtos/courseModifyDto";

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
    createMap(mapper, CourseCreationDto, Course,
        forMember((dest) => dest.isActive, ignore()),
        typeConverter([String], [Date], (dates) => {
            let convertedDates: Date[] = []
            dates.forEach((date) => convertedDates.push(new Date(date)))
            return convertedDates;
        })
    );
    createMap(mapper, CourseModifyDto, Course,
        forMember((dest) => dest.courseId, ignore()),
        forMember((dest) => dest.isActive, ignore()),
        forMember((dest) => dest.description, 
            condition((src) => src.description !== undefined)),
        forMember((dest) => dest.name,
            condition((src) => src.name !== undefined)),
        forMember((dest) => dest.schedule,
            condition((src) => src.schedule !== undefined)),
        forMember((dest) => dest.studentLimit, 
            condition((src) => src.studentLimit !== undefined)),
        forMember((dest) => dest.teacherName, 
            condition((src) => src.teacherName !== undefined))
    );
    createMap(mapper, Course, CourseDetailsDto);
}