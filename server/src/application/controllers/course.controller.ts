import { Request, Response, Router } from "express";
import { PassportStatic } from "passport";
import * as courseService from "../services/course.service";
import { User } from "../../domain/entities/user";
import { checkUserRole } from "../auth/auth";
import { UserRoles } from "../../domain/enums/userRoles";

export const configureCourseRoutes = (
    passport: PassportStatic,
    courseRouter: Router): Router => {
        
        courseRouter.post("/create", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send("You must be logged in to access that");
            }
            if (!checkUserRole(req, UserRoles.Admin)){
                return res.status(403).send("You don't have permission to access that");
            }

            try {
                const isCreated = await courseService.createCourseAsync();
    
                if (isCreated){
                    return res.status(201).send("Created new course");
                } else {
                    return res.status(500).send("Failed to create new course");
                }
            } catch (error) {
                return res.status(400).send(error instanceof Error ? error.message: "Unknown error");
            }
        });

        return courseRouter;
}