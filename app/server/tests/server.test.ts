import request from "supertest";
import app from "../src/startup";

describe("Express Backend API", () => {
  it("should respond with 404 for unknown route", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("should have /users route", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(401);
  });

  it("should have /courses route", async () => {
    const res = await request(app).get("/courses");
    expect(res.status).toBe(401)
  });
});
