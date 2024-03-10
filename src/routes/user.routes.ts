import { userController } from "../controllers/user.controllers";

const express = require("express");
const userRouter = express.Router();

// CREATE USER
userRouter.post("/signup", userController.createUser);

// UPDATE USER
userRouter.put("/update-user/:userId", userController.updateUser);

// UPDATE USER ROLE
userRouter.put("/update-user-role/:userId", userController.updateUserRole);

// LOGIN
userRouter.post("/login", userController.login);

// LOGOUT
userRouter.get("/logout", userController.logout);

// GET USERS WITHOUT PASSWORDS
userRouter.get("/retrieve-users-list", userController.getUsers);

export default userRouter;
