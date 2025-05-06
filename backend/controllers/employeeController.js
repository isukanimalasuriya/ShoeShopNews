import Employee from "../modeles/employeeModel.js";
import { User } from "../modeles/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

export function loginUser(req, res){

    const data = req.body

    Employee.findOne({
        email: data.email
    }).then(
        (user)=>{
            
            if(user==null){
                res.status(404).json({error: "User not found"})
            }else{

                const isPasswordCorrect = bcrypt.compareSync(data.password, user.password)

                if(isPasswordCorrect){
                    const token = jwt.sign({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                        profilePic: user.profilePic
                    }, process.env.JWT_SECRET)
                    res.json({message: "Login success", token:token, user: user})
                }else{
                    res.status(401).json({error: "Login failed"})
                }
            }
        }
    )

}

export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  };


  export const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        });
      }
      
      // Delete the user
      await User.findByIdAndDelete(userId);
      
      res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  };

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
        const hashedPassword = await bcrypt.hash(password, 10);
        employee = new Employee({ name, email, password: hashedPassword, role, age });
        await employee.save();

        const employeeResponse = employee.toObject();
        delete employeeResponse.password;
        
        return res.status(201).json({ employee: employeeResponse });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Unable to add employee" });
    }

    // if (!employee) {
    //     return res.status(400).json({ message: "Unable to add employee" });
    // }

    // return res.status(201).json({ employee });
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


export const updatePassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token payload
    const { email } = decoded;
    
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await Employee.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};