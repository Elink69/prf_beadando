export class CourseModifyDto{
    constructor(
        public name: string | undefined,
        public description: string | undefined,
        public schedule: string[] | undefined,
        public studentLimit: number | undefined,
        public teacherName: string | undefined
    ){}
}