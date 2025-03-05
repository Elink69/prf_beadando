import * as mongodb from "mongodb";
import { AutoMap } from "@automapper/classes";

export class Course{
    @AutoMap()
    courseId: string;

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
            "courseId",
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
            courseId: {
                bsonType: "string"
            },
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

