import request from "supertest";
import User from "../src/models/user.model.js";
import Task from "../src/models/task.model.js";
import app from "../src/app";
import bootstrap from "./bootstrap.js";

describe("Task", () => {
  let user, token, task;

  beforeEach(async () => {
    user = await User.create({
      username: "test user",
      email: "test@example.com",
      password: "@Password123",
    });

    task = await Task.create({
      title: "test task",
      description: "Test task description",
      owner: user._id,
    });

    const preRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "@Password123",
    });

    token = preRes.body.data.accessToken;
  });

  describe("POST /api/tasks", () => {
    describe("Create task", () => {
      it("should not create a new task without auth credentials", async () => {
        const res = await request(app).post("/api/tasks").send({
          title: "test task",
          description: "This is my test task description",
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("statusCode");
        expect(res.body.message).toBe(
          "Authentication credentials were not provided"
        );
      });
    });

    it("should create a new task with auth credentials", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test task",
          description: "This is my test task description",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("statusCode");
    });

    it("should not create a new task with auth credentials and incomplete req.body data", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test task",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("statusCode");
    });
  });

  describe("GET /api/tasks", () => {
    describe("Get list of tasks", () => {
      it("should return a list of tasks related to the authenticated user", async () => {
        const res = await request(app)
          .get("/api/tasks")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("statusCode");
      });

      it("should throw an error if authentication credentials are not provided", async () => {
        const res = await request(app).get("/api/tasks");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("statusCode");
        expect(res.body.message).toBe(
          "Authentication credentials were not provided"
        );
      });
    });
  });

  describe("GET /api/tasks/:taskId", () => {
    describe("Get a single task", () => {
      it("should get a task when auth credentials are provided", async () => {
        const res = await request(app)
          .get(`/api/tasks/${task._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("statusCode");
      });

      it("should not get a task when auth credentials are not provided", async () => {
        const res = await request(app).get(`/api/tasks/${task._id}`);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("statusCode");
        expect(res.body.message).toBe(
          "Authentication credentials were not provided"
        );
      });
    });
  });

  describe("PUT /api/tasks/:taskId", () => {
    describe("Update a task", () => {
      it("should update a task if auth credentials are provided", async () => {
        const res = await request(app)
          .put(`/api/tasks/${task._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            title: "Updated test task",
          });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("statusCode");
      });

      it("should not update a task if auth credentials are not provided", async () => {
        const res = await request(app).put(`/api/tasks/${task._id}`).send({
          title: "Updated test task",
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("statusCode");
        expect(res.body.message).toBe(
          "Authentication credentials were not provided"
        );
      });
    });
  });

  describe("DELETE /api/tasks/:taskId", () => {
    describe("Delete a task", () => {
      it("should delete a task if user is authenticated and is owner", async () => {
        const res = await request(app)
          .delete(`/api/tasks/${task._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body).toHaveProperty("statusCode");
      });
    });
  });
});
