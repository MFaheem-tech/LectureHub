import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import { sendToken } from "../utils/sendToken.js";

export default {
	register: asyncHandler(async (req, res) => {
		const { name, email, password }=req.body;
		// const file = req.file;
		if (!name||!email||!password) {
			return res.status(400).json({ message: "Please fill all fields" });
		}
		let user=await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}
		user=await User.create({
			name,
			email,
			password,
			avatar: {
				publicId: "temp",
				url: "temp",
			},
		});
		sendToken(res, user, "User Registered Successfully", 200);
	}),

	login: asyncHandler(async (req, res) => {
		const { email, password }=req.body;
		if (!email||!password) {
			return res.status(400).json({ message: "Please fill all fields" });
		}
		const user=await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const isMatch=await user.comparePassword(password);
		if (!isMatch) {
			return res.status(400).json({ message: "Password is incorrect" });
		}
		sendToken(res, user, "User Logged In Successfully", 200);
	}),

	logout: asyncHandler(async (req, res) => {
		return res
			.status(200)
			.cookie("token", null, {
				expires: new Date(Date.now()),
			})
			.json({
				success: true,
				message: "Logout Successfully",
			});
	}),

	profile: asyncHandler(async (req, res) => {

		const userId=req.user._id;
		console.log(userId)

		const user=await User.findById(userId).select("+password");
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		return res.status(200).json({
			success: true,
			data: user,
		});
	}),
};
