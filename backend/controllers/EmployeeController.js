// EmployeeController.js
import Employee from "../modeles/Employeemodel.js";

// Get all employees
export const getAllEmployees = async (req, res, next) => {
    let employees;
    try {
        employees = await Employee.find();
    } catch (err) {
        console.log(err);
    }

    if (!employees) {
        return res.status(404).json({ message: "No employees found" });
    }

    return res.status(200).json({ employees });
};

// Add a new employee
export const addEmployee = async (req, res, next) => {
    const { name, email, password, role, age } = req.body;
    let employee;

    try {
        employee = new Employee({ name, email, password, role, age });
        await employee.save();
    } catch (err) {
        console.log(err);
    }

    if (!employee) {
        return res.status(400).json({ message: "Unable to add employee" });
    }

    return res.status(201).json({ employee });
};

// Get an employee by ID
export const getEmployeeById = async (req, res, next) => {
    const id = req.params.id;
    let employee;

    try {
        employee = await Employee.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ employee });
};

// Update an employee
export const updateEmployee = async (req, res, next) => {
    const id = req.params.id;
    const { name, email, password, role, age } = req.body;
    let employee;

    try {
        employee = await Employee.findByIdAndUpdate(id, { name, email, password, role, age }, { new: true });
    } catch (err) {
        console.log(err);
    }

    if (!employee) {
        return res.status(404).json({ message: "Unable to update employee" });
    }

    return res.status(200).json({ employee });
};

// Delete an employee
export const deleteEmployee = async (req, res, next) => {
    const id = req.params.id;
    let employee;

    try {
        employee = await Employee.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!employee) {
        return res.status(404).json({ message: "Unable to delete employee" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
};
