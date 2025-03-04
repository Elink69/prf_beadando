import { Request, Response, Router } from "express";
import { PassportStatic } from "passport";
import * as courseService from "../services/course.service";
import { User } from "../../domain/entities/user";
import { extractUserRole } from "../auth/auth";
import { UserRoles } from "../../domain/enums/userRoles";

export const configureCourseRoutes = (
    passport: PassportStatic,
    courseRouter: Router): Router => {
        
        courseRouter.post("/create", async (req: Request, res: Response) => {
            if(req.isAuthenticated() && extractUserRole(req) === UserRoles.Admin){
                try {
                    const isCreated = await courseService.createCourseAsync();
        
                    if (isCreated){
                        res.status(201).send("Created new course");
                    } else {
                        res.status(500).send("Failed to create new course");
                    }
                } catch (error) {
                    res.status(400).send(error instanceof Error ? error.message: "Unknown error");
                }
            }
        });

        return courseRouter;
}