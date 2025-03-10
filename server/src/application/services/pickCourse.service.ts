import { use } from "passport";
import { PickedCourse } from "../../domain/entities/pickedCourse"
import { collections } from "../dbContext/dbContext"

export const pickCourseAsync = async (userEmail: string, courseId: string): Promise<boolean> => {
    const pickedCourse = new PickedCourse();
    pickedCourse.userEmail = userEmail;
    pickedCourse.courseId = courseId;
    const insertResult = await collections?.picked_courses?.insertOne(pickedCourse);
    return !!insertResult;
}

export const dropCourseAsync = async (userEmail: string, courseId: string): Promise<boolean> => {
    const deleteResult = await collections?.picked_courses?.deleteOne(
        {
            userEmail: userEmail,
            courseId: courseId
        }
    );
    return !!deleteResult;
}