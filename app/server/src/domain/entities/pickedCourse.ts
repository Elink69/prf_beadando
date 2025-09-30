import { Document, model, Model, Schema } from "mongoose";
import { DbCollections } from "../enums/dbCollections";

interface IPickedCourse extends Document{
    userEmail: string;
    courseId: string;
}

const pickedCourseSchmea: Schema<IPickedCourse> = new Schema ({
    userEmail: {type: String, required: true},
    courseId: {type: String, required: true}
});

export const PickedCourse: Model<IPickedCourse> = model<IPickedCourse>(DbCollections.PickedCourses, pickedCourseSchmea);