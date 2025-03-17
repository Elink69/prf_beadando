import * as mongodb from "mongodb"

export class ClassroomCourse{
    classRoomId: string;

    courseId: string;

    _id?: mongodb.ObjectId;
}

export const classroomCourseJsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: [
           "classRoomId",
           "courseId"
        ],
        additionalProperties: false,
        properties: {
            _id: {},
            classRoomId: {
                bsonType: "string"
            },
            courseId: {
                bsonType: "string"
            }
        }
    }
}
