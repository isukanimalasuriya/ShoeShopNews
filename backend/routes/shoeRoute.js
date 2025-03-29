import express from "express";

import { addProduct, getShoes, getOneShoeDetail } from "../controllers/shoeController.js";

const shoeRouter = express.Router();

shoeRouter.post("/",addProduct);
shoeRouter.get("/",getShoes);
shoeRouter.get("/:id",getOneShoeDetail);

export default shoeRouter