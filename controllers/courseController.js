import Course from "../models/course.js";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";


export default {
	getAllCourses: async (req, res) => {
		try {
			const courses=await Course.find({}).select("-lectures");
			res.status(200).json({ success: true, courses });
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	},
	createCourse: async (req, res) => {
		const createdBy=req.user._id;
		const { title, description, category }=req.body;
		const { file }=req;

		try {
			if (!title||!description||!category) {
				return res.status(400).json({ success: false, message: "Please fill all the fields" });
			}
			const user=await User.findById(createdBy);
			if (!user) {
				return res.status(404).json({ success: false, message: "User not found" });
			}
			let coverImage='';
			if (file) {
				coverImage=file.path;
			}
			const createdCourse=await Course.create({
				title,
				description,
				category,
				createdBy,
				coverImage,
			});
			res.status(201).json({ success: true, message: "Course Created", createdCourse });
		} catch (error) {
			res.status(500).json({ success: false, message: "Failed to create course", error: error.message });
		}
	},

	updateCourse: async (req, res) => {
		const courseId=req.params.id;
		const { title, description, category }=req.body;

		try {
			const course=await Course.findById(courseId);
			if (!course) {
				return res.status(404).json({ message: 'Course not found' });
			}

			if (title) course.title=title;
			if (description) course.description=description;
			if (category) course.category=category;

			await course.save();

			res.status(200).json({ success: true, message: 'Course updated successfully', course });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	getCourseLectures: async (req, res) => {
		const courseId=req.params.id;
		try {
			const course=await Course.findById(courseId);
			if (!course) {
				return res.status(404).json({ message: "Course not found" });
			}

			course.views+=1;
			await course.save();
			res.status(200).json({ success: true, lectures: course.lectures });

		} catch (error) {
			res.status(500).json({ message: "Error fetching course lectures", error: error.message });
		}
	},

	addCourseLecture: async (req, res) => {
		const { courseId }=req.params;
		const { title, description, file }=req.body;

		try {
			const course=await Course.findById(courseId);
			if (!course) {
				return res.status(404).json({ message: "Course not found" });
			}

			course.lectures.push({
				title,
				description,
				video: file? file:''
			});

			course.numOfVideos=course.lectures.length;
			await course.save();
			res.status(201).json({ success: true, message: "Lecture added successfully" });

		} catch (error) {
			res.status(500).json({ message: "Failed to add lecture", error: error.message });
		}
	},

	removeCourse: async (req, res) => {
		const { courseId }=req.params;
		try {
			const deletedCourse=await Course.findByIdAndDelete(courseId);
			if (!deletedCourse) {
				return res.status(404).json({ success: false, message: "Course not found" });
			}
			res.status(200).json({ success: true, message: "Course deleted successfully" });

		} catch (error) {
			res.status(500).json({ message: "Failed to delete course", error: error.message });
		}
	},

	deleteLecture: async (req, res) => {
		const { lectureId, courseId }=req.params;
		try {
			const course=await Course.findById(courseId);
			if (!course) {
				return res.status(404).json({ message: "Course not found" });
			}

			const lectureIndex=course.lectures.findIndex(lecture => lecture._id.equals(lectureId));
			if (lectureIndex===-1) {
				return res.status(404).json({ message: "Lecture not found in the course" });
			}

			course.numOfVideos-=1;
			course.lectures.splice(lectureIndex, 1);
			await course.save();
			res.status(200).json({ success: true, message: "Lecture deleted successfully" });

		} catch (error) {
			res.status(500).json({ message: "Failed to delete lecture", error: error.message });
		}
	},

}