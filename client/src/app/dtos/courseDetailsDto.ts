import { Classroom } from "./classroom"

export class CourseDetailsDto{
    constructor(
        public courseId: string,
        public name: string,
        public description: string,
        public schedule: Date[],
        public studentLimit: number,
        public teacherName: string,
        public isActive: boolean,
        public classRoom: Classroom,
    ){}
}