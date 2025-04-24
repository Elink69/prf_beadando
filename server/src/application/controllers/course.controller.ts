import { Request, Response, Router } from "express";
import * as courseService from "../services/course.service";
import { checkUserRole } from "../auth/auth";
import { UserRoles } from "../../domain/enums/userRoles";
import { CourseCreationDto } from "../dtos/courseCreationDto";
import { CourseModifyDto } from "../dtos/courseModifyDto";
import { IUser } from "../../domain/entities/user";
import { CourseDetailsDto } from "../dtos/courseDetailsDto";

export const configureCourseRoutes = (
    courseRouter: Router): Router => {
        
        courseRouter.get("/", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }

            try{
                const courses = await courseService.getCoursesAsync();
                courses.sort((a,b) => a.isActive < b.isActive ? -1 : a.isActive > b.isActive ? 1 : a.courseId.localeCompare(b.courseId));
                return res.status(200).send(courses);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }

        });

        courseRouter.get("/picked", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }
            const user = req.user as IUser;
            try{
                const courses = await courseService.getPickedCoursesAsync(user.email);
                return res.status(200).send(courses);
            }
            catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });

        courseRouter.get("/active", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }

            try{
                const courses = await courseService.getActiveCoursesAsync();
                return res.status(200).send(courses);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });

        courseRouter.get("/classrooms", async (req: Request, res: Response): Promise<any> => {
          if(!req.isAuthenticated()){
            return res.status(401).send({error:"You must be logged in to access that"});
          }
          if(!checkUserRole(req, UserRoles.Teacher)){
            return res.status(403).send({error:"You don't have permission to access that"});
          };
          try{
            return res.status(200).send(await courseService.getClassroomsAsync());
          } catch (err) {
            return res.status(500).send({error: (err instanceof Error ? err.message : "Unknown Error")});
          }
        });

        courseRouter.get("/:courseId", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }

            const courseId = req?.params?.courseId;
            try{
                const course = await courseService.getCourseByIdAsync(courseId);
                return res.status(200).send(course);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });

        courseRouter.post("/", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }
            if(!checkUserRole(req, UserRoles.Teacher)){
                return res.status(403).send({error:"You don't have permission to access that"});
            };
            const newCourseDto = req.body as CourseCreationDto;
            try {
                let isCreated;
                
                if(checkUserRole(req, UserRoles.Admin)){
                    isCreated = await courseService.createCourseAsync(newCourseDto, UserRoles.Admin);
                }else if(checkUserRole(req, UserRoles.Teacher)){
                    isCreated = await courseService.createCourseAsync(newCourseDto, UserRoles.Teacher);
                }
    
                if (!isCreated){
                    return res.status(500).send({error:"Failed to create new course"});
                } else {
                    return res.status(201).send({message:"Created new course"});
                }
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });

        courseRouter.put("/:courseId", async (req: Request, res: Response): Promise<any> => {
            
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }
            if(!checkUserRole(req, UserRoles.Teacher)){
                return res.status(403).send({error:"You don't have permission to access that"});
            };

            const courseId = req?.params?.courseId
            let currentCourse: CourseDetailsDto | null = null
            try{
              currentCourse = await courseService.getCourseByIdAsync(courseId)
            } catch (err) {
              return res.status(500).send({error: (err instanceof Error ? err.message : "Unknown Error")});
            }
            const currentUser = req.user as IUser
            
            if (!checkUserRole(req, UserRoles.Admin) && currentUser.email !== currentCourse.teacherName){
                return res.status(403).send({error:"Teachers can only modify their own courses"});
            }

            const courseUpdate = req.body as CourseModifyDto;
            if(!courseUpdate){
                return res.status(400).send({error:"Bad request"});
            }

            try{
                await courseService.updateCourseAsync(courseUpdate, courseId);
                return res.status(200).send({message:"Course modified"});
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
                
        });

        courseRouter.delete("/:courseId", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }
            if(!checkUserRole(req, UserRoles.Teacher)){
                return res.status(403).send({error:"You don't have permission to access that"});
            };

            const courseId = req?.params?.courseId;

            let courseToDelete: CourseDetailsDto | null = null
            try{
              courseToDelete = await courseService.getCourseByIdAsync(courseId)
            } catch (err) {
              return res.status(500).send({error: (err instanceof Error ? err.message : "Unknown Error")});
            }
            const currentUser = req.user as IUser

            if(!checkUserRole(req, UserRoles.Admin) && currentUser.name !== courseToDelete.teacherName){
                return res.status(403).send({error:"Teachers can only delete their own courses"});
            }

            try{
                if(await courseService.deleteCourseAsync(courseId)){
                    return res.status(200).send({message:"Course deleted"});
                }
                else{
                    return res.status(500).send({error:"Internal Server Error"});
                };
            } catch (error){
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });
        
      
        return courseRouter;
}