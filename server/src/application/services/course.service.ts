import { Classroom } from "../../domain/entities/classroom";
import { ClassroomCourse } from "../../domain/entities/classroomCourse";
import { Course } from "../../domain/entities/course"
import { PickedCourse } from "../../domain/entities/pickedCourse";
import { UserRoles } from "../../domain/enums/userRoles";
import { CourseCreationDto } from "../dtos/courseCreationDto";
import { CourseDetailsDto } from "../dtos/courseDetailsDto";
import { CourseModifyDto } from "../dtos/courseModifyDto";

const findClassroom = async (courseId: string): Promise<typeof Classroom | null> => {
    const connetion = await ClassroomCourse.findOne({courseId: courseId});
    if(connetion){
        return await Classroom.findOne({classRoomId: connetion.classroomId})
    }else{
        return null;
    }
}

export const getCoursesAsync = async (): Promise<CourseDetailsDto[]> => {
    const courses = await Course.find({});
    const coursesDetails: CourseDetailsDto[] = []
    await Promise.all(
      courses.map(async course => {
          const classroom = await findClassroom(course.courseId);
          coursesDetails.push(
            new CourseDetailsDto(
              course.courseId,
              course.name,
              course.description,
              course.schedule,
              course.studentLimit,
              course.teacherName,
              course.isActive,
              classroom
            )
          )
        }
      )
    );
    return coursesDetails;
}

export const getPickedCoursesAsync = async (email: string): Promise<CourseDetailsDto[]> => {
    const pickedCourses = await PickedCourse.find({userEmail: email});
    const pickedCoursesDetails: CourseDetailsDto[] = []
    await Promise.all(
        pickedCourses.map(async pickedCourse => {
            const course = await Course.findOne({courseId: pickedCourse.courseId})
            if(!course){
              throw new Error("Course not found");
            }
            const classroom = await findClassroom(course.courseId);
            pickedCoursesDetails.push(
                new CourseDetailsDto(
                    course.courseId,
                    course.name,
                    course.description,
                    course.schedule,
                    course.studentLimit,
                    course.teacherName,
                    course.isActive,
                    classroom
                )
            )
        })
    );
    return pickedCoursesDetails;
} 

export const getActiveCoursesAsync = async (): Promise<CourseDetailsDto[]> => {
    const courses = await Course.find({isActive: true});
    const activeCourses: CourseDetailsDto[] = [];
    await Promise.all(
        courses.map(async course => {
            const classroom = await findClassroom(course.courseId)
            activeCourses.push(new CourseDetailsDto(
                course.courseId,
                course.name,
                course.description,
                course.schedule,
                course.studentLimit,
                course.teacherName,
                course.isActive,
                classroom
            ))
        })
    );
    
    return activeCourses;
}

export const getCourseByIdAsync = async (courseId: string): Promise<CourseDetailsDto> => {
    const course = await Course.findOne({courseId: courseId});
    if (!course){
        throw new Error("Course not found");
    }
    const classroom = await findClassroom(course.courseId);
    const result = new CourseDetailsDto(
        course.courseId,
        course.name,
        course.description,
        course.schedule,
        course.studentLimit,
        course.teacherName,
        course.isActive,
        classroom
    )
    return result; 
}

export const updateCourseAsync = async (courseDto: CourseModifyDto, courseId: string): Promise<void> => {
    const currentCourse = await Course.findOne({courseId: courseId});
    if(currentCourse){
      currentCourse.name = courseDto.name;
      currentCourse.description = courseDto.description;
      currentCourse.schedule = [];
      courseDto.schedule?.forEach((dateString) => {
          currentCourse.schedule.push(new Date(dateString));
      });
      currentCourse.studentLimit = courseDto.studentLimit;
      currentCourse.teacherName = courseDto.teacherName;
      currentCourse.isActive = courseDto.isActive
      await currentCourse.save();
    }
}

export const createCourseAsync = async (courseDto: CourseCreationDto, role: UserRoles): Promise<boolean> => {
    const scheduleDates: Date[] = [];
    courseDto.schedule?.forEach((dateString) => {
        scheduleDates.push(new Date(dateString));
    });
    const newCourse = new Course({
        courseId: courseDto.courseId,
        description: courseDto.description,
        name: courseDto.name,
        schedule: scheduleDates,
        studentLimit: courseDto.studentLimit,
        teacherName: courseDto.teacherName
    });
    if(role === UserRoles.Admin){
        newCourse.isActive = true;
    }else if(role === UserRoles.Teacher){
        newCourse.isActive = false;
    }

    const insertResult = await newCourse.save();
    return !!insertResult;
}

export const deleteCourseAsync = async (courseId: string): Promise<boolean> => {
    const deleteResult = await Course.deleteOne({courseId: courseId})
    return !!deleteResult
};