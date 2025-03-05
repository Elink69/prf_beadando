import { AutoMap } from "@automapper/classes";

export class CourseDetailsDto{
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
}