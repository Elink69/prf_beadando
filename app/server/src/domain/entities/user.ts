import { DbCollections } from "../enums/dbCollections";
import { UserRoles } from "../enums/userRoles"
import { Document, model, Model, Schema } from "mongoose";
import bcrypt from "bcrypt"

const SALT_FACTOR = 10;

export interface IUser extends Document{
    name: string;
    password: string;
    email: string;
    role: UserRoles;
    createdOn: Date;
    comparePassword: (candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void) => void;
}

const userSchema: Schema<IUser> = new Schema ({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: Number, required: true},
    createdOn: {type: Date},
});

userSchema.pre('save', function (next) {
    const user = this;

    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, encrypted) => {
            if (err) {
                return next(err);
            }
            user.password = encrypted;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void): void
{
  const user = this;
  bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
    if (error) {
      callback(error, false);
    }
    callback(null, isMatch);
  });
}

export const User: Model<IUser> = model<IUser>(DbCollections.Users, userSchema)