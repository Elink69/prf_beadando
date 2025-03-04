import * as mongodb from "mongodb"
import { UserRoles } from "../enums/userRoles"
import { AutoMap } from "@automapper/classes"

export class User {
    @AutoMap()
    name: string;

    password: string;

    @AutoMap()
    email: string;

    @AutoMap(() => Number)
    role: UserRoles;

    @AutoMap()
    createdOn: Date;

    _id?: mongodb.ObjectId;
}

export const userJsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["name", "password", "email", "role"],
        additionalProperties: false,
        properties: {
            _id: {},
            name: {
                bsonType: "string",
                description: "'name' is required"
            },
            password: {
                bsonType: "string",
                description: "'password' is required"
            },
            email: {
                bsonType: "string",
                description: "'email' is required"
            },
            role: {
                bsonType: "number",
                description: "'role' is required"
            },
            createdOn: {
                bsonType: "date"
            }
        }
    }
}