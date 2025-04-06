import { PickedCourse } from "../../domain/entities/pickedCourse"

export const pickCourseAsync = async (userEmail: string, courseId: string): Promise<boolean> => {
    const pickedCourse = new PickedCourse();
    pickedCourse.userEmail = userEmail;
    pickedCourse.courseId = courseId;
    const insertResult = await pickedCourse.save();
    return !!insertResult;
}

export const dropCourseAsync = async (userEmail: string, courseId: string): Promise<boolean> => {
    const deleteResult = await PickedCourse.deleteOne(
        {
            userEmail: userEmail,
            courseId: courseId
        }
    );
    return !!deleteResult;
}