import { Router } from "express";
import courseController from "../controllers/courseController.js";
import { auth } from "../middlewares/auth.js"
const router=Router();

router.get('/get-all-courses', courseController.getAllCourses);
router.post('/add-course', auth, courseController.createCourse);
router.put('/edit-course/:id', courseController.updateCourse);
router.get('/course-lectures/:id', courseController.getCourseLectures);
router.post('/lecture/:courseId', courseController.addCourseLecture);
router.delete('/remove-course/:courseId', courseController.removeCourse);
router.delete('/lecture/:lectureId/course/:courseId', courseController.deleteLecture);



export default router;