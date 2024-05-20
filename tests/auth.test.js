import request from "supertest";
import { config } from "dotenv";
import User from "../src/models/user.model.js";
import app from "../src/app";
import bootstrap from "./bootstrap.js";
config();

describe("Auth controllers", () => {
  describe("POST /api/auth/register", () => {
    describe("Register user", () => {
      it("Should create a new user", async () => {
        const res = await request(app).post("/api/auth/register").send({
          username: "testUser",
          email: "test@example.com",
          password: "@Password123",
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("statusCode");
      });
    });

    it("Should throw an error with missing input data", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testUser",
        password: "@Password123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("statusCode");
    });
  });

  describe("POST /api/auth/login", () => {
    let user;
    beforeEach(async () => {
      user = await User.create({
        username: "test user",
        email: "test@example.com",
        password: "@Password123",
      });
    });

    describe("Login user", () => {
      it("Should login user if data is correct", async () => {
        const res = await request(app).post("/api/auth/login").send({
          email: "test@example.com",
          password: "@Password123",
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("statusCode");
        expect(res.body.data).toHaveProperty("message");
        expect(res.body.data.message).toBe("Login successful");
      });

      it("Should throw 'Password is incorrect' on incorrect password", async () => {
        const res = await request(app).post("/api/auth/login").send({
          email: "test@example.com",
          password: "@Password124",
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("statusCode");
        expect(res.body.message).toBe("Password is incorrect");
      });

      it("Should throw 'User with email does not exist' on incorrect email", async () => {
        const res = await request(app).post("/api/auth/login").send({
          email: "test0@example.com",
          password: "@Password123",
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("statusCode");
        expect(res.body.message).toBe("User with email does not exist");
      });
    });
  });
});
