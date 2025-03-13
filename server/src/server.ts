import * as dotenv from "dotenv";
import * as mappers from "./application/mappers/mapper";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import { connectToDatabase } from "./application/dbContext/dbContext";
import { configureUserRoutes } from "./application/controllers/user.controller";
import { configurePassport } from "./application/auth/auth";
import bodyParser from "body-parser";
import { configureCourseRoutes } from "./application/controllers/course.controller";
import { configurePickCourseRouter } from "./application/controllers/pickCourse.controller";

dotenv.config();

const { DB_URI } = process.env;

if(!DB_URI){
    console.error(
        "No DB_URI environment variable found"
    );
    process.exit(1);
}


connectToDatabase(DB_URI)
    .then(() => {
        mappers.createMaps();

        const app = express();

        app.use(
            cors({
              origin: (origin, callback) => {
                callback(null, true);
              },
              credentials: true,
            })
          );
        
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

        app.use(cookieParser());

        app.use(expressSession({
            secret: "testSecret",
            resave: false,
            saveUninitialized: false
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        configurePassport(passport);
        app.use("/users", configureUserRoutes(passport, express.Router()));
        app.use("/courses", configureCourseRoutes(express.Router()));
        app.use("/pickCourse", configurePickCourseRouter(express.Router()));
        app.listen(12212, () => {
            console.log(`Server running on http://localhost:12212`);
        });
    })
    .catch((error) => console.error(error));