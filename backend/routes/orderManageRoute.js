import express from "express";

import { addOrders, deleteOrder, displayOrders, getAllOrders } from "../controllers/orderManagementController.js";

const OrderRoute = express.Router();

OrderRoute.post("/",addOrders)
OrderRoute.get("/all",getAllOrders)
OrderRoute.get("/:userId",displayOrders)
OrderRoute.delete("/:id",deleteOrder)


export default OrderRoute