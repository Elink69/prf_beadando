import * as mongodb from "mongodb";
import { User, userJsonSchema } from "../../domain/entities/user";
import { Course, courseJsonSchema } from "../../domain/entities/course";
import { DbCollections } from "../../domain/enums/dbCollections";

export const collections: {
    users?: mongodb.Collection<User>;
    courses?: mongodb.Collection<Course>;
} = {};

export const connectToDatabase = async (uri: string): Promise<void> => {
    const mongoClient = new mongodb.MongoClient(uri);
    await mongoClient.connect();

    const db = mongoClient.db("fakeNeptun");
    await schemaValidation(db);
    
    collections.users = db.collection<User>(DbCollections.Users);
    collections.courses = db.collection<Course>(DbCollections.Courses);
}

const schemaValidation = async (db: mongodb.Db): Promise<void> => {
    const dbCollections = Object.values(DbCollections)
    const jsonSchemas = [
        userJsonSchema,
        courseJsonSchema
    ]

    dbCollections.forEach(async (collectionName, index) => {
        await db.command({
            collMod: collectionName,
            validator: jsonSchemas[index]
        }).catch(async (error: mongodb.MongoServerError) => {
            if (error.codeName === "NamespaceNotFound") {
                console.log(`creating collection: ${collectionName}`)
                await db.createCollection(collectionName, {validator: jsonSchemas[index]})
            }
        })
    });

}