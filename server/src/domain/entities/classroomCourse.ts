import { DbCollections } from "../enums/dbCollections";
import { Document, model, Model, Schema } from "mongoose";

interface IClassroomCourse extends Document {
    classroomId: string;
    courseId: string;
}

const classroomCourseSchema: Schema<IClassroomCourse> = new Schema ({
    classroomId: {type: String, required: true},
    courseId: {type: String, required: true}
});

export const ClassroomCourse: Model<IClassroomCourse> = model<IClassroomCourse>(DbCollections.ClassroomCourses, classroomCourseSchema)