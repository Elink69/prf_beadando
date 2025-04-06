import { DbCollections } from "../enums/dbCollections";
import { UserRoles } from "../enums/userRoles"
import { Document, model, Model, Schema } from "mongoose";

export interface IUser extends Document{
    name: string;
    password: string;
    email: string;
    role: UserRoles;
    createdOn: Date;
}

const userSchema: Schema<IUser> = new Schema ({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: Number, required: true},
    createdOn: {type: Date},
});

export const User: Model<IUser> = model<IUser>(DbCollections.Users, userSchema)