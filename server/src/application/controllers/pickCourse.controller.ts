import { Request, Response, Router } from "express";
import { IUser } from "../../domain/entities/user";
import { dropCourseAsync, pickCourseAsync } from "../services/pickCourse.service";

export const configurePickCourseRouter = (
    pickCourseRouter: Router): Router => {

        pickCourseRouter.post("/:courseId", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }

            const currentUser = req?.user as IUser;
            const courseId = req?.params?.courseId;

            try{
                if(await pickCourseAsync(currentUser.email, courseId)){
                    return res.status(200).send({message:"Class picked successfully"});
                }else{
                    return res.status(500).send({error: "Internal Server Error"});
                }
            } catch (error: any){
                console.log(error.errInfo.details.schemaRulesNotSatisfied)
                res.status(500).send({error:error instanceof Error? error.message: "Unknown error"});
            }
        });

        pickCourseRouter.delete("/:courseId", async (req: Request, res: Response): Promise<any> => {
            if(!req.isAuthenticated()){
                return res.status(401).send({error:"You must be logged in to access that"});
            }

            const currentUser = req?.user as IUser;
            const courseId = req?.params?.courseId;

            try{
                if(await dropCourseAsync(currentUser.email, courseId)){
                    return res.status(200).send({message:"Class dropped successfully"});
                }else{
                    return res.status(500).send({error: "Internal Server Error"});
                }
            } catch (error) {
                res.status(500).send({error: error instanceof Error? error.message: "Unknown error"});
            }
        });

        return pickCourseRouter;
}