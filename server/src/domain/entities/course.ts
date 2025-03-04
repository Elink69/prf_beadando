import * as mongodb from "mongodb";
import { AutoMap } from "@automapper/classes";

export class Course{
    @AutoMap()
    name: string;

    @AutoMap()
    description: string;

    @AutoMap(() => [Date])
    schedule: Date[];

    @AutoMap()
    studentLimit: number;

    @AutoMap()
    teacherName: string;

    @AutoMap()
    isActive: boolean;

    _id?: mongodb.ObjectId;
}

export const courseJsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "name",
            "description",
            "schedule", 
            "studentLimit",
            "teacherName", 
            "isActive"
        ],
        additionalProperties: false,
        properties: {
            _id: {},
            name: {
                bsonType: "string",
            },
            description: {
                bsonType: "string",
            },
            schedule: {
                bsonType: "array",
                minItems: 1,
                uniqueItems: true,
                items: {
                    bsonType: "date"
                }
            },
            studentLimit: {
                bsonType: "number"
            },
            teacherName: {
                bsonType: "string"
            },
            isActive: {
                bsonType: "bool"
            }
        }
    }
}

