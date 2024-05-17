import { Router } from "express";
import { body, param } from "express-validator";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

// enpoints

router
  .route("/")
  .post(
    authenticate,
    body("title")
      .notEmpty()
      .withMessage("This field is required")
      .escape()
      .trim(),
    body("description")
      .notEmpty()
      .withMessage("This field is required")
      .escape()
      .trim(),
    createTask
  )
  .get(authenticate, getTasks);

router
  .route("/:taskId")
  .get(
    authenticate,
    param("taskId").notEmpty().withMessage("This field is required").trim(),
    getTask
  )
  .put(
    authenticate,
    param("taskId").notEmpty().withMessage("This field is required"),
    body("title").optional().escape().trim(),
    body("description").optional().escape().trim(),
    updateTask
  )
  .delete(
    authenticate,
    param("taskId").notEmpty().withMessage("This field is required"),
    deleteTask
  );

export default router;
