import { Router } from "express";
import userController from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";


const router=Router();

router.post('/register', userController.register)
router.post('/login', userController.login);
router.get('/logout', userController.logout)
router.get('/profile', auth, userController.profile)
export default router;