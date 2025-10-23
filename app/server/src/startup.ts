import * as dotenv from "dotenv";
import express, { NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import { configureUserRoutes } from "./application/controllers/user.controller";
import { configurePassport } from "./application/auth/auth";
import bodyParser from "body-parser";
import { configureCourseRoutes } from "./application/controllers/course.controller";
import { configurePickCourseRouter } from "./application/controllers/pickCourse.controller";
import mongoose from 'mongoose';
import  MongoStore  from "connect-mongo";
import promClient from "prom-client"
import promBundle from "express-prom-bundle"
import { MongoMemoryServer } from "mongodb-memory-server"

const register = new promClient.Registry();

promClient.collectDefaultMetrics({
  register,
  prefix: 'backend_'
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code']
});

register.registerMetric(httpRequestTotal);

const metricsMiddleware = promBundle({
  includeMethod: true, 
 includePath: true, 
 includeStatusCode: true, 
 includeUp: true,
 promRegistry: register,
 autoregister: true
});


dotenv.config();
const { DB_URI } = process.env;

if (process.env.NODE_ENV !== "test"){
  console.log("NEM TESZT")
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

app.use((req, res, next) => {
  httpRequestTotal.labels(req.method, req.path, `${res.statusCode}`)
  .inc();
  next();
})

app.use(metricsMiddleware)

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

if (process.env.NODE_ENV !== "test"){
app.use(expressSession({
    secret: "testSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DB_URI
    })
}));
}
else{
  app.use(expressSession({
    secret: "testSecret",
    resave: false,
    saveUninitialized: false,
}));
}

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);
app.use("/users", configureUserRoutes(passport, express.Router()));
app.use("/courses", configureCourseRoutes(express.Router()));
app.use("/pickCourse", configurePickCourseRouter(express.Router()));

export default app