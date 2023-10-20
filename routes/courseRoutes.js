import { Router } from "express";
import courseController from "../controllers/courseController.js";
const router=Router();

router.get('/get-all-courses', courseController.getAllCourses);
router.post('/add-course', courseController.createCourse);

export default router;