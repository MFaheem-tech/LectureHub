import { Router } from "express";
import adminController from "../controllers/adminController.js";
import { Admin } from "../middlewares/role.js";
const router=Router();

router.get("/dashboard", adminController.adminDashboardCounts);
router.get("/courses", adminController.getAllCourses);
router.get("/specific-course/:id", adminController.getSpecificCourse);
router.get("/students", adminController.viewAllStudent);
router.get("/teachers", adminController.viewAllTeacher);
router.get("/specific-user/:id", adminController.viewSingleUser);

export default router;