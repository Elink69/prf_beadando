export class CourseModifyDto{
    constructor(
        public name: string,
        public description: string,
        public schedule: string[],
        public studentLimit: number,
        public teacherName: string
    ){}
}