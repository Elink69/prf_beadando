import { Router, Request, Response, NextFunction, json } from "express";
import * as userService from "../services/user.service";
import { PassportStatic } from "passport";
import { User, userJsonSchema } from "../../domain/entities/user";
import { UserCreationDto } from "../dtos/userCreationDto";
import { checkUserRole } from "../auth/auth";
import { UserRoles } from "../../domain/enums/userRoles";

export const configureUserRoutes = (
    passport: PassportStatic,
    userRouter: Router): Router => {

        userRouter.get("/", async (_req: Request, res: Response): Promise<any> => {
            try {
                const users = await userService.getUsersAsync();
                return res.status(200).send(users);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? error.message: "Unknown error");
            }
        });

        userRouter.get("/:email", async (req: Request, res: Response): Promise<any> => {
            const email = req?.params?.email;
            try {
                const user = await userService.getUserByEmailAsync(email);
                return res.status(200).send(user);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? error.message: "Unknown error");
            }
        });

        userRouter.post("/register", async (req: Request, res: Response): Promise<any> => {
            const newUser = req.body as UserCreationDto;
            try {
                const isCreated = await userService.createUserAsync(newUser);
    
                if (isCreated){
                    return res.status(201).send("Created new user");
                } else {
                    return res.status(500).send("Failed to create new user");
                }
            } catch (error) {
                return res.status(500).send(error instanceof Error ? error.message: "Unknown error");
            }
        });

        userRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate("local", (error: string | null, user: User) => {
                if (error) {
                    res.status(500).send(error)
                } else {
                    req.login(user, (error: string | null) => {
                        if (error) {
                            console.log(error);
                            res.status(500).send("Internal server error.")
                        } else {
                            res.status(200).send(user)
                        }
                    });
                }
            }) (req, res, next);
        });

        userRouter.post("/logout", async (req: Request, res: Response): Promise<any> => {
            if (req.isAuthenticated()) {
                req.logout((error) => {
                    if(error){
                        console.log(error);
                        return res.status(500).send("Internal server error.");
                    }
                    return res.status(200).send("Succesfully logged out.");
                });
            } else {
                return res.status(401).send("User is not logged in.");
            }
        });

        userRouter.delete("/:userEmail", async (req: Request, res: Response): Promise<any> => {
            if (!req.isAuthenticated()){
                return res.status(401).send("You must be logged in to access that");
            };
            if(!checkUserRole(req, UserRoles.Admin)){
                return res.status(403).send("You don't have permission to access that");
            };
            
            const userEmail = req?.params?.userEmail;

            try{
                if(await userService.deleteUserAsync(userEmail)){
                    return res.status(200).send("User deleted");
                } else {
                    return res.status(500).send("Internal Server Error");
                }
            } catch (error) {
                return res.status(500).send(error instanceof Error? error.message: "Unknown error");
            }
        });

        return userRouter;
}