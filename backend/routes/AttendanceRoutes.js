const express = require("express");
const router = express.Router();

// Import Attendance Model & Controller
const Attendance = require("../modeles/Attendancemodel");
const AttendanceController = require("../controllers/AttendanceControllers");

// Define Routes
router.get("/", AttendanceController.getAllAttendance);
router.post("/", AttendanceController.addAttendance);
router.get("/:id", AttendanceController.getAttendanceById);
router.put("/:id", AttendanceController.updateAttendance);
router.delete("/:id", AttendanceController.deleteAttendance);

// Export Router
module.exports = router;


