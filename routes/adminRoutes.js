import { Router } from "express";
import adminController from "../controllers/adminController.js";
import { auth } from "../middlewares/auth.js";
import { Admin } from "../middlewares/role.js";
const router=Router();

router.get("/register", adminController.signUp);
router.get("/login", adminController.login);
router.get("/profile", auth, Admin, adminController.profile);
router.get("/dashboard", auth, Admin, adminController.adminDashboardCounts);
router.get("/courses", auth, Admin, adminController.getAllCourses);
router.get("/specific-course/:id", auth, Admin, adminController.getSpecificCourse);
router.get("/students", auth, Admin, adminController.viewAllStudent);
router.get("/teachers", auth, Admin, adminController.viewAllTeacher);
router.get("/specific-user/:id", auth, Admin, adminController.viewSingleUser);

export default router;