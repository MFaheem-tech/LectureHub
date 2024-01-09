import { Router } from "express";
import userController from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { Admin, User } from "../middlewares/role.js";



const router=Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', auth, User, userController.profile);
router.put('/update-profile', auth, User, userController.updateProfile);
router.put('/change-password', auth, User, userController.changePassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/add-to-playlist/:id', auth, User, userController.addToPlaylist);
router.post('/remove-from-playlist/:id', auth, User, userController.removeFromPlaylist);
router.post('/file', userController.uploadSingleImageHandler)
export default router;