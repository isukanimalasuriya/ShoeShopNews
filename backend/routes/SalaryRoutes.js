import express from "express";
import {
    getAllSalary,
    addSalary,
    getSalaryById,
    updateSalary,
    deleteSalary
} from "../controllers/salaryController.js";

const SalaryRoutes = express.Router();

SalaryRoutes.get("/", getAllSalary);
SalaryRoutes.post("/", addSalary);
SalaryRoutes.get("/:id", getSalaryById);
SalaryRoutes.put("/:id", updateSalary);
SalaryRoutes.delete("/:id", deleteSalary);

export default SalaryRoutes;
