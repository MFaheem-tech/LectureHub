import { Router } from "express";
import courseController from "../controllers/courseController.js";
import { auth } from "../middlewares/auth.js"
import { Teacher } from "../middlewares/role.js";
const router=Router();

router.get('/get-all-courses', auth, Teacher, courseController.getAllCourses);
router.post('/add-course', auth, Teacher, courseController.createCourse);
router.put('/edit-course/:id', auth, Teacher, courseController.updateCourse);
router.get('/course-lectures/:id', auth, Teacher, courseController.getCourseLectures);
router.post('/lecture/:courseId', auth, Teacher, courseController.addCourseLecture);
router.delete('/remove-course/:courseId', auth, Teacher, courseController.removeCourse);
router.delete('/lecture/:lectureId/course/:courseId', auth, Teacher, courseController.deleteLecture);



export default router;