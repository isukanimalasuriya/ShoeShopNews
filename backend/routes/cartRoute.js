import express from "express";

import { addTocart,displaycart,updateCartQuantity,deleteCartItem, cartCount } from "../controllers/addTocart.js";

const cartRoute = express.Router();

cartRoute.post("/",addTocart)
cartRoute.get("/:userId",displaycart)
cartRoute.put("/:userId",updateCartQuantity)
cartRoute.delete("/:userId",deleteCartItem)
cartRoute.get("/count/:userId",cartCount);

export default cartRoute