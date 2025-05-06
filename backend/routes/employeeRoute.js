import express from "express";
import { loginUser, getAllUsers, deleteUser,updatePassword,updateEmployee } from "../controllers/employeeController.js";
import { verifyToken } from "../middleware/authsEmpMiddleware.js";

const userRouter = express.Router()

userRouter.post("/login", loginUser)
userRouter.put("/update-password", verifyToken, updatePassword)
userRouter.get("/", getAllUsers)
userRouter.delete("/:id", deleteUser)
userRouter.put("/:id", updateEmployee);


export default userRouter