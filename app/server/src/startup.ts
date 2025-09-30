import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import { configureUserRoutes } from "./application/controllers/user.controller";
import { configurePassport } from "./application/auth/auth";
import bodyParser from "body-parser";
import { configureCourseRoutes } from "./application/controllers/course.controller";
import { configurePickCourseRouter } from "./application/controllers/pickCourse.controller";
import mongoose, { mongo } from 'mongoose';

dotenv.config();

if (process.env.NODE_ENV !== "test"){
  const { DB_URI } = process.env;

  if(!DB_URI){
      console.error(
          "No DB_URI environment variable found"
      );
      process.exit(1);
  }

  mongoose.connect(DB_URI).then((data) => {
    console.log('Successfully connected to MongoDB');
  }).catch(err=> {
    console.log(err)
    return;
  });
}

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

export default app