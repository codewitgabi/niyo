import { Router } from "express";
import { body } from "express-validator";
import { login, logout, register } from "../controllers/user.controllers.js";

const router = Router();

// endpoints

router.post(
  "/register",
  body("username").notEmpty().withMessage("Thsi field is required").escape(),
  body("email")
    .notEmpty()
    .withMessage("This field is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .escape(),
  body("password").notEmpty().withMessage("This field is required").escape(),
  register
);

router.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("This field is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .escape(),
  body("password").notEmpty().withMessage("This field is required").escape(),
  login
);

router.post("/logout", logout)

export default router;
