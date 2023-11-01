import { Router } from "express";
import userController from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";


const router=Router();

router.post('/register', userController.register)
router.post('/login', userController.login);
router.get('/logout', userController.logout)
router.get('/profile', auth, userController.profile)
router.put('/update-profile', auth, userController.updateProfile)
router.put('/change-password', auth, userController.changePassword)
export default router;