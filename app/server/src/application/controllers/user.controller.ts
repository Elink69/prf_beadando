import { Router, Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { PassportStatic } from "passport";
import { UserCreationDto } from "../dtos/userCreationDto";
import { checkUserRole } from "../auth/auth";
import { UserRoles } from "../../domain/enums/userRoles";
import { IUser, User } from "../../domain/entities/user";
import { UserModifyDto } from "../dtos/userModifyDto";

export const configureUserRoutes = (
    passport: PassportStatic,
    userRouter: Router): Router => {

        userRouter.get("/", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }
            try {
                const users = await userService.getUsersAsync();
                return res.status(200).send(users);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });
        
        userRouter.get("/userInfo", async (req: Request, res: Response): Promise<any> => {
          if (!req.isAuthenticated){
            return res.status(401).send({error:"You must be logged in to access that"})
          }
          if(req.user){
            const email = (req.user as IUser).email;
            try {
              const user = await userService.getUserByEmailAsync(email);
              return res.status(200).send(user);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
          } else{
            return res.status(500).send({error: "Internal Server Error"});
          }
        });

        userRouter.get("/checkAuth", async (req: Request, res: Response): Promise<any> => {
            if (req.isAuthenticated()){
                return res.status(200).send(true);
            } else {
                return res.status(401).send(false);
            }
        });

        userRouter.get("/role", async (req: Request, res: Response): Promise<any> => {
            if (req.isAuthenticated()){
                return res.status(200).send({"role": (req.user as IUser).role})
            } else {
                return res.status(401).send({error:"You must be logged in to access that"});
            }
        });

        userRouter.get("/:email", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
              return res.status(401).send({error:"You must be logged in to access that"});
            }
            const email = req?.params?.email;
            try {
                const user = await userService.getUserByEmailAsync(email);
                return res.status(200).send(user);
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });

        userRouter.put("/:email", async (req: Request, res: Response): Promise<any> => {
          if(!req.isAuthenticated()){
            return res.status(401).send({error:"You must be logged in to access that"});
          }
          const email = req.params?.email;
          const userEdit = req.body as UserModifyDto
          try {
            const result = await userService.modifyUser(email, userEdit);
            if(result){
              return res.status(200).send({message: "Modified user"});
            }else{
              return res.status(500).send({error: "Failed to modify user"});
            }
          }
          catch (error) {
            return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
          }
        });

        userRouter.post("/register", async (req: Request, res: Response): Promise<any> => {
            const newUser = req.body as UserCreationDto;
            try {
                const isCreated = await userService.createUserAsync(newUser);
    
                if (isCreated){
                    return res.status(201).send({message: "Created new user"});
                } else {
                    return res.status(500).send({error: "Failed to create new user"});
                }
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });

        userRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate("local", (error: string | null, user: typeof User) => {
                if (error) {
                    res.status(500).send({error: error})
                } else {
                    req.login(user, (error: string | null) => {
                        if (error) {
                            console.log(error);
                            res.status(500).send({error: "Internal server error."})
                        } else {
                            res.status(200).send(user)
                        }
                    });
                }
            }) (req, res, next);
        });

        userRouter.post("/logout", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }
            req.logout((error) => {
                if(error){
                    console.log(error);
                    return res.status(500).send({error:"Internal server error."});
                }
                return res.status(200).send({message:"Succesfully logged out."});
            });
        });

        userRouter.delete("/:userEmail", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }
            if(!checkUserRole(req, UserRoles.Admin)){
                return res.status(403).send({error:"You don't have permission to access that"});
            };
            
            const userEmail = req?.params?.userEmail;

            try{
                if(await userService.deleteUserAsync(userEmail)){
                    return res.status(200).send({message:"User deleted"});
                } else {
                    return res.status(500).send({error:"Internal Server Error"});
                }
            } catch (error) {
                return res.status(500).send(error instanceof Error ? {error: error.message}: {error: "Unknown error"});
            }
        });


        return userRouter;
}