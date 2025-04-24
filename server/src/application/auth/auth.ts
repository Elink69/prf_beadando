import { PassportStatic } from "passport";
import { Strategy } from "passport-local";
import { User, IUser } from "../../domain/entities/user";
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
        const user = await User.findOne({email: email});
        if(!user){
            return done("Incorrect username or password");
        }
        user.comparePassword(password, (error, isMatch) => {
          if (error){
            done("Incorrect username or password");
          } else if (isMatch){
            done(null, user);
          } else{
            done("Incorrect password");
          }
        });
    }));

    return passport;
}

export const checkUserRole = (req: Request, minRole: UserRoles): boolean => {
    const user = req.user as IUser;
    if (!user){
        return false;
    }
    return user.role <= minRole;
}