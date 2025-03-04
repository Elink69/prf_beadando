import { Course } from "../../domain/entities/course"
import { collections } from "../dbContext/dbContext";

export const createCourseAsync = async () => {
    const newCourse = new Course()
    newCourse.name = "elso";
    newCourse.description = "elso description";
    newCourse.isActive = true;
    newCourse.schedule = [new Date()];
    newCourse.studentLimit = 2;
    newCourse.teacherName = "elso tanár";

    const insertResult = await collections?.courses?.insertOne(newCourse);

    if (!insertResult){       
        return false;
    } else {
        return insertResult.acknowledged;
    }
}