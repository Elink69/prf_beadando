import { Request, Response, Router } from "express";
import * as courseService from "../services/course.service";
import { checkUserRole } from "../auth/auth";
import { UserRoles } from "../../domain/enums/userRoles";
import { CourseCreationDto } from "../dtos/courseCreationDto";
import { CourseModifyDto } from "../dtos/courseModifyDto";
import { User } from "../../domain/entities/user";

export const configureCourseRoutes = (
    courseRouter: Router): Router => {
        
        courseRouter.get("/", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send("You must be logged in to access that");
            }

            try{
                const courses = await courseService.getCoursesAsync();
                return res.status(200).send(courses);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? error.message: "Unknown error");
            }

        });

        courseRouter.get("/:courseId", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send("You must be logged in to access that");
            }

            const courseId = req?.params?.courseId;
            try{
                const course = await courseService.getCourseByIdAsync(courseId);
                return res.status(200).send(course);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? error.message: "Unknown error");
            }
        });

        courseRouter.post("/", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send("You must be logged in to access that");
            }
            if (!checkUserRole(req, UserRoles.Teacher)){
                return res.status(403).send("You don't have permission to access that");
            }
            const newCourseDto = req.body as CourseCreationDto;
            try {
                let isCreated;
                
                if(checkUserRole(req, UserRoles.Admin)){
                    isCreated = await courseService.createCourseAsync(newCourseDto, UserRoles.Admin);
                }else if(checkUserRole(req, UserRoles.Teacher)){
                    isCreated = await courseService.createCourseAsync(newCourseDto, UserRoles.Teacher);
                }
    
                if (!isCreated){
                    return res.status(500).send("Failed to create new course");
                } else {
                    return res.status(201).send("Created new course");
                }
            } catch (error) {
                return res.status(400).send(error instanceof Error ? error.message : "Unknown error");
            }
        });

        courseRouter.patch("/:courseId", async (req: Request, res: Response): Promise<any> => {
            
            if(!req.isAuthenticated()){
                return res.status(401).send("You must be logged in to access that");
            }
            if (!checkUserRole(req, UserRoles.Teacher)){
                return res.status(403).send("You don't have permission to access that");
            }

            const courseId = req?.params?.courseId
            
            const currentCourse = await courseService.getCourseByIdAsync(courseId)
            const currentUser = req.user as User
            
            if (!checkUserRole(req, UserRoles.Admin) && currentUser.name !== currentCourse.teacherName){
                return res.status(403).send("Teachers can only modify their own courses");
            }

            const courseUpdate = req.body as CourseModifyDto;
            if(!courseUpdate){
                return res.status(400).send("Bad request");
            }

            try{
                await courseService.updateCourseAsync(courseUpdate, courseId);
                return res.status(200).send("Course modified")  
            } catch (error) {
                return res.status(400).send(error instanceof Error ? error.message: "Unknown error");
            }
                
        });

        courseRouter.delete("/:courseId", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send("You must be logged in to access that");
            }
            if(!checkUserRole(req, UserRoles.Teacher)){
                return res.status(403).send("You don't have permission to access that");
            }

            const courseId = req?.params?.courseId;

            const courseToDelete = await courseService.getCourseByIdAsync(courseId);
            const currentUser = req.user as User

            if(!checkUserRole(req, UserRoles.Admin) && currentUser.name !== courseToDelete.teacherName){
                return res.status(403).send("Teachers can only delete their own courses");
            }

            try{
                if(await courseService.deleteCourseAsync(courseId)){
                    return res.status(200).send("Course deleted");
                }
                else{
                    return res.status(500).send("Internal Server Error");
                };
            } catch (error){
                return res.status(400).send(error instanceof Error? error.message: "Unknown error");
            }
        });

        return courseRouter;
}