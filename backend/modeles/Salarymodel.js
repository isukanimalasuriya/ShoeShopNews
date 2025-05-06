import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    baseSalary: {
        type: Number,
        required: true,
    },
    overtimeHours: {
        type: Number,
        required: true,
        min: 0,
    },
    bonus: {
        type: Number,
        required: true,
        min: 0,
    },
    totalSalary: {
        type: Number,
        required: true,
        min: 0,
    },
    position: {
        type: String,
        enum: ["HR_MANAGER", "DELIVERY_MANAGER", "DELIVERY_PERSON", "admin"],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
