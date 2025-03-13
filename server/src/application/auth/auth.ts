import { PassportStatic } from "passport";
import { Strategy } from "passport-local";
import { collections } from "../dbContext/dbContext";
import { User } from "../../domain/entities/user";
import { mapper } from "../mappers/mapper";
import { UserDetailsDto } from "../dtos/userDetailsDto";
import { UserRoles } from "../../domain/enums/userRoles";
import { Request } from "express";

export const configurePassport = (passport: PassportStatic): PassportStatic => {

    passport.serializeUser((user: Express.User, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {
        done(null, user);
    });

    passport.use("local", new Strategy(async (email, password, done) => {
        const user = await collections?.users?.findOne({email: email}) as User;
        if(!user){
            return done("Incorrect username or password");
        }
        if (password === user.password){
            return done(null, await mapper.mapAsync(user, User, UserDetailsDto))
        } else {
            return done("Incorrect username or password.")
        }
    }));

    return passport;
}

export const checkUserRole = (req: Request, minRole: UserRoles): boolean => {
    const user = req.user as User;
    if (!user){
        return false;
    }
    return user.role <= minRole;
}