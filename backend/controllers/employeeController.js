import Employee from "../modeles/employeeModel.js";
import { User } from "../modeles/user.model.js";
import brcypt from "bcrypt";
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

                const isPasswordCorrect = brcypt.compareSync(data.password, user.password)

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