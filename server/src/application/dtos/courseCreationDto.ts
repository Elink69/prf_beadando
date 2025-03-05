import { AutoMap } from "@automapper/classes";

export class CourseCreationDto {
    @AutoMap()
    courseId: string;

    @AutoMap()
    name: string;

    @AutoMap()
    description: string;

    @AutoMap(() => [String])
    schedule: string[];

    @AutoMap()
    studentLimit: number;

    @AutoMap()
    teacherName: string;
}