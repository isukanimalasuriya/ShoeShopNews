import express from "express";

import {addAttendance,getAttendanceById,updateAttendance,deleteAttendance} from "../controllers/AttendanceController"

const AttendanceRoutes= express.Router();

AttendanceRoutes.post("/",addAttendance)
AttendanceRoutes.get("/:userId",getAttendanceById)
AttendanceRoutes.put("/:userId",updateAttendance)
AttendanceRoutes.delete("/:userId",deleteAttendance)

export default AttendanceRoutes


