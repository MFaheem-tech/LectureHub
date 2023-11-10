import Course from "../models/course.js";
import asyncHandler from "express-async-handler";


export default {
	getAllCourses: asyncHandler(async (req, res) => {
		try {
			const courses=await Course.find({}).select("-lectures");
			res.status(200).json({ success: true, courses });
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
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
	}),

	getCourseLectures: asyncHandler(async (req, res) => {
		const courseId=req.params.id;
		try {
			const course=await Course.findById({ _id: courseId });
			if (!course) {
				res.status(400).json({ message: "Course not found" });
			}

			course.views+=1;
			await course.save();
			res.status(201).json({ success: true, lectures: course.lectures });

		} catch (error) {
			res.status(500).json({ message: error.message });

		}
	}),
	addCourseLecture: asyncHandler(async (req, res) => {
		const { courseId }=req.params;
		const { title, description, file }=req.body;

		try {
			const course=await Course.findById({ _id: courseId });
			if (!course) {
				res.status(400).json({ message: "Course not found" });
			}
			course.lectures.push({
				title, description, video: file? file:''
			})
			course.numOfVideos=course.lectures.length;
			await course.save();
			res.status(201).json({ success: true, message: "Lecture added successfully" });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}),
	removeCourse: asyncHandler(async (req, res) => {
		const { courseId }=req.params;
		try {
			await Course.findByIdAndDelete({ _id: courseId });
			res.status(200).json({ success: true, message: "Course deleted successfully" });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}),
	deleteLecture: asyncHandler(async (req, res) => {
		const { lectureId, courseId }=req.params;
		try {
			const course=await Course.findById({ _id: courseId });
			if (!course) {
				res.status(400).json({ message: "Course not found" });
			}

			const lectureIndex=course.lectures.findIndex(lecture => lecture._id.equals(lectureId))

			if (lectureIndex===-1) {
				return res.status(400).json({ message: "Lecture not found in the course" });
			}
			course.numOfVideos-=1;
			course.lectures.splice(lectureIndex, 1);
			await course.save();
			res.status(200).json({ success: true, message: "Lecture deleted successfully" });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
	)
}