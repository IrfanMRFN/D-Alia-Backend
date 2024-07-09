import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", changePassword);

export default userRouter;
