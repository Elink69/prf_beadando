import { DbCollections } from "../enums/dbCollections";
import { Document, model, Model, Schema } from "mongoose";

interface ICourse extends Document {
    courseId: string;
    name: string;
    description: string;
    schedule: Date[];
    studentLimit: number;
    teacherName: string;
    isActive: boolean;
}

const courseSchema: Schema<ICourse> = new Schema({
    courseId: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    schedule: {type: [Date], required: true},
    studentLimit: {type: Number, required: true},
    teacherName: {type: String, required: true},
    isActive: {type: Boolean, required: true}
});

export const Course: Model<ICourse> = model<ICourse>(DbCollections.Courses, courseSchema);