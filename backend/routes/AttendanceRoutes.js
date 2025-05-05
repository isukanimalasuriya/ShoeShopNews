import express from "express";

import {getAllAttendance,addAttendance,getAttendanceById,updateAttendance,deleteAttendance} from "../controllers/AttendanceController.js"

const AttendanceRoutes= express.Router();

AttendanceRoutes.get("/",getAllAttendance)
AttendanceRoutes.post("/",addAttendance)
AttendanceRoutes.get("/:userId",getAttendanceById)
AttendanceRoutes.put("/:userId",updateAttendance)
AttendanceRoutes.delete("/:userId",deleteAttendance)

export default AttendanceRoutes;


