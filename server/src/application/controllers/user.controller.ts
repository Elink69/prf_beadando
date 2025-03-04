import { Router, Request, Response, NextFunction, json } from "express";
import * as userService from "../services/user.service";
import { PassportStatic } from "passport";
import { User } from "../../domain/entities/user";
import { UserCreationDto } from "../dtos/userCreationDto";

export const configureUserRoutes = (
    passport: PassportStatic,
    userRouter: Router): Router => {
        
        userRouter.use(json());

        userRouter.get("/", async (_req: Request, res: Response) => {
            try {
                const users = await userService.getUsersAsync();
                res.status(200).send(users);
            } catch (error) {
                res.status(500).send(error instanceof Error ? error.message: "Unknown error");
            }
        });

        userRouter.get("/:email", async (req: Request, res: Response) => {
            const email = req?.params?.email;
            try {
                const user = await userService.getUserByEmailAsync(email);
                res.status(200).send(user);
            } catch (error) {
                res.status(500).send(error instanceof Error ? error.message: "Unknown error");
            }
        });

        userRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {
            const newUser = req.body as UserCreationDto;
            try {
                const isCreated = await userService.createUserAsync(newUser);
    
                if (isCreated){
                    res.status(201).send("Created new user");
                } else {
                    res.status(500).send("Failed to create new user");
                }
            } catch (error) {
                res.status(400).send(error instanceof Error ? error.message: "Unknown error");
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

        userRouter.post("/logout", async (req: Request, res: Response) => {
            if (req.isAuthenticated()) {
                req.logout((error) => {
                    if(error){
                        console.log(error);
                        res.status(500).send("Internal server error.");
                    }
                    res.status(200).send("Succesfully logged out.");
                });
            } else {
                res.status(500).send("User is not logged in.");
            }
        });

        return userRouter;
}