export class CourseModifyDto{
    constructor(
        public name: string,
        public description: string,
        public schedule: Date[],
        public studentLimit: number,
        public teacherName: string,
        public isActive: boolean
    ){}
}