export class CourseCreationDto{
    constructor(
        public courseId: string,
        public name: string,
        public description: string,
        public schedule: string[],
        public studentLimit: number,
        public teacherName: string
    ){}
}