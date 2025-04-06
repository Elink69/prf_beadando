import { Document, model, Model, Schema } from "mongoose";
import { DbCollections } from "../enums/dbCollections";

export interface IClassroom extends Document{
    classRoomId: string;
    building: string;
    floor: number;
    roomNumber: number;
}

const classroomSchema: Schema<IClassroom> = new Schema ({
    classRoomId: {type: String, required: true},
    building: {type: String, required: true},
    floor: {type: Number, required: true},
    roomNumber: {type: Number, required: true}
});

export const Classroom: Model<IClassroom> = model<IClassroom>(DbCollections.Classrooms, classroomSchema);