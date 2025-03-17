import * as mongodb from "mongodb";
import { AutoMap } from "@automapper/classes";

export class Classroom{
   
    @AutoMap()
    classRoomId: string;

    @AutoMap()
    building: string;

    @AutoMap()
    floor: number;

    @AutoMap()
    roomNumber: number;

    _id?: mongodb.ObjectId;
}

export const classroomJsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: [
           "building",
           "floor",
           "roomNumber"
        ],
        additionalProperties: false,
        properties: {
            _id: {},
            classRoomId: {
                bsonType: "string"
            },
            building: {
                bsonType: "string"
            },
            floor: {
                bsonType: "number"
            },
            roomNumber: {
                bsonType: "number"
            }
        }
    }
}

