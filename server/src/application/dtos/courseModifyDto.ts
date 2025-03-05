import { AutoMap } from "@automapper/classes";

export class CourseModifyDto{
    @AutoMap()
    name: string | undefined;

    @AutoMap()
    description: string | undefined;

    @AutoMap(() => [String])
    schedule: string[] | undefined;

    @AutoMap()
    studentLimit: number | undefined;

    @AutoMap()
    teacherName: string | undefined;
}