import { Classroom } from "../../domain/entities/classroom";
import { Course } from "../../domain/entities/course"
import { UserRoles } from "../../domain/enums/userRoles";
import { collections } from "../dbContext/dbContext";
import { CourseCreationDto } from "../dtos/courseCreationDto";
import { CourseDetailsDto } from "../dtos/courseDetailsDto";
import { CourseModifyDto } from "../dtos/courseModifyDto";
import { mapper } from "../mappers/mapper";

const mapClassroom = async (course: CourseDetailsDto): Promise<CourseDetailsDto> => {
    const classroomId = (await collections?.classroom_course?.findOne({courseId: course.courseId}))?.classRoomId;
    course.classRoom = (await collections?.classroom?.findOne({classRoomId: classroomId})) as Classroom;
    return course;
}

export const getCoursesAsync = async (): Promise<CourseDetailsDto[]> => {
    const courses = await collections?.courses?.find({}).toArray() as Course[];
    const courseDetails = await mapper.mapArrayAsync(courses, Course, CourseDetailsDto);
    courseDetails.forEach(async (course) => {
        course = await mapClassroom(course)
    })
    return courseDetails;
}

export const getActiveCoursesAsync = async (): Promise<CourseDetailsDto[]> => {
    const courses = await collections?.courses?.find({isActive: true}).toArray() as Course[];
    const courseDetails = await mapper.mapArrayAsync(courses, Course, CourseDetailsDto);
    courseDetails.forEach(async (course) => {
        course = await mapClassroom(course);
    })
    return courseDetails;
}

export const getCourseByIdAsync = async (courseId: string): Promise<CourseDetailsDto> => {
    const query = {courseId: courseId}
    const course = await collections?.courses?.findOne(query)
    return await mapClassroom(await mapper.mapAsync(course, Course, CourseDetailsDto));
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