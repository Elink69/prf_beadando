import * as dotenv from "dotenv";
import * as mappers from "./app/mappers/mapper";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import { connectToDatabase } from "./app/dbContext/dbContext";
import { configureUserRoutes } from "./app/controllers/user.controller";
import { configurePassport } from "./app/auth/auth";
import bodyParser from "body-parser";
import { configureCourseRoutes } from "./app/controllers/course.controller";

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

        app.use(cors());
        
        app.use(bodyParser.urlencoded({extended: true}))

        app.use(cookieParser());

        app.use(expressSession({
            secret: "testSecret",
            resave: false,
            saveUninitialized: true
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        configurePassport(passport);
        app.use("/users", configureUserRoutes(passport, express.Router()));
        app.use("/courses", configureCourseRoutes(passport, express.Router()))
        app.listen(12212, () => {
            console.log(`Server running on http://localhost:12212`);
        });
    })
    .catch((error) => console.error(error));