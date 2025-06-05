import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup" , signup); 
router.post("/login" , login);
router.post("/logout" , logout);  //here we used post method instead of get method because post method is any operation that changes the server state

router.post("/onboarding", protectRoute, onboard);

//TODO : add a forget password route and send-reset-password email

//checks if user is logged in or not
router.get("/me",protectRoute, (req,res) => {
    res.status(200).json( { success: true , user: req.user});
})
export default router;
