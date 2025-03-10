import { CursorFlag } from "mongodb";
import { Course } from "../../domain/entities/course"
import { UserRoles } from "../../domain/enums/userRoles";
import { collections } from "../dbContext/dbContext";
import { CourseCreationDto } from "../dtos/courseCreationDto";
import { CourseDetailsDto } from "../dtos/courseDetailsDto";
import { CourseModifyDto } from "../dtos/courseModifyDto";
import { mapper } from "../mappers/mapper";

export const getCoursesAsync = async (): Promise<CourseDetailsDto[]> => {
    const courses = await collections?.courses?.find({}).toArray() as Course[];
    return await mapper.mapArrayAsync(courses, Course, CourseDetailsDto);
}

export const getCourseByIdAsync = async (courseId: string): Promise<CourseDetailsDto> => {
    const query = {courseId: courseId}
    const course = await collections?.courses?.findOne(query)
    return await mapper.mapAsync(course, Course, CourseDetailsDto);
}

export const updateCourseAsync = async (courseDto: CourseModifyDto, courseId: string): Promise<void> => {
    const query = {courseId: courseId}
    const currentCourse = await collections?.courses?.findOne(query)
    if(currentCourse){
        await mapper.mutateAsync(courseDto, currentCourse, CourseModifyDto, Course);
        currentCourse.schedule = [];
        courseDto.schedule?.forEach((dateString) => {
            currentCourse.schedule.push(new Date(dateString));
        });
        await collections?.courses?.findOneAndReplace(query, currentCourse, {upsert: true});
    }
}

export const createCourseAsync = async (courseDto: CourseCreationDto, role: UserRoles): Promise<boolean> => {
    const newCourse = await mapper.mapAsync(courseDto, CourseCreationDto, Course);
    if(role === UserRoles.Admin){
        newCourse.isActive = true;
    }else if(role === UserRoles.Teacher){
        newCourse.isActive = false;
    }

    const insertResult = await collections?.courses?.insertOne(newCourse);

    return !!insertResult;
}

export const deleteCourseAsync = async (courseId: string): Promise<boolean> => {
    const deleteResult = await collections?.courses?.deleteOne({courseId: courseId})
    return !!deleteResult
};