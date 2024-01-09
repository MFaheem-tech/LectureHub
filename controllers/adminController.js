import Course from "../models/course.js";
import User from "../models/user.js";
import { sendToken } from "../utils/sendToken.js";

export default {
	login: async (req, res) => {
		try {
			const { body }=req;
			const user=await User.findOne({ email: body.email, role: "admin" });
			if (!user) {
				return res.status(400).json({ error: "Invalid credential" });
			}
			const isMatch=await user.comparePassword(password);
			if (!isMatch) {
				return res.status(400).json({ message: "Password is incorrect" });
			}
			sendToken(res, user, "User Logged In Successfully", 200);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},
	profile: async (req, res) => {
		try {
			const userId=req.user._id;
			const user=await User.findById(userId);
			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},

	adminDashboardCounts: async (req, res) => {
		try {
			const studentCount=await User.countDocuments({ role: 'user' });
			const coursesCount=await Course.countDocuments();
			const teachersCount=await User.countDocuments({ role: "teacher" });

			res.status(200).json({
				studentCount,
				coursesCount,
				teachersCount,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	getAllCourses: async (req, res) => {
		try {
			let courses;
			courses=await Course.find({}).populate('createdBy');
			res.status(200).json({
				courses,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	getSpecificCourse: async (req, res) => {
		try {
			const courseId=req.params.id;
			const course=await Course.findById(courseId)
				.populate('createdBy');

			if (!course) {
				return res.status(404).json({
					msg: 'Course not found',
				});
			}
			res.status(200).json({
				course,
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	viewAllStudent: async (req, res) => {
		try {
			const students=await User.find({ role: 'user' });
			res.status(200).json({ success: true, students });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},
	viewAllTeacher: async (req, res) => {
		try {
			const teachers=await User.find({ role: 'teacher' });
			res.status(200).json({ success: true, teachers });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},
	viewSingleUser: async (req, res) => {
		const userId=req.params.id;
		try {
			const user=await User.findById(userId);
			if (!user) {
				return res.status(404).json({ success: false, message: 'User not found' });
			}
			res.status(200).json({ success: true, user });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},
}