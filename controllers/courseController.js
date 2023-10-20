import Course from "../models/course.js";
import asyncHandler from "express-async-handler";


export default {
	getAllCourses: asyncHandler(async (req, res) => {
		const courses=await Course.find({}).select("-lectures");
		res.status(200).json({ success: true, courses });
	}),
	createCourse: asyncHandler(async (req, res) => {
		const { title, description, category, createdBy }=req.body;
		if (!title||!description||!category||!createdBy) {
			return res.status(400).json({ success: false, message: "Please fill all the fields" });
		}
		// const file=req.file;
		await Course.create({
			title,
			description,
			category,
			createdBy,
			poster: {
				publicId: 'some',
				url: "some location"
			}
		});
		res.status(201).json({ success: true, message: "Course Created" });
	})
}