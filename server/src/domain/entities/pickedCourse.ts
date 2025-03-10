import * as mongodb from "mongodb"

export class PickedCourse{
    userEmail: string;
    courseId: string;
    _id?: mongodb.ObjectId;
}

export const pickedCourseJsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["userEmail", "courseId"],
        additionalProperties: false,
        properties: {
            _id: {},
            userEmail: {
                bsonType: "string"
            },
            courseId: {
                bsonType: "string"
            }
        }
    }
}