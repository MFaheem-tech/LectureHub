import User from "../models/user.js";
import { sendToken } from "../utils/sendToken.js";
import sendEmail from "../utils/sendMail.js"
import Course from "../models/course.js";
import { uploadSingleFile } from "../middlewares/uploader.js"
import { v2 as cloudinaryV2 } from "cloudinary";
import streamifier from "streamifier";


const code=Math.floor(1000+Math.random()*15*60*1000);

export default {
	register: async (req, res) => {
		const { name, email, password, profile }=req.body;
		try {
			let { role }=req.body;

			if (!role) {
				role='user';
			}
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
				profile,
			});
			sendToken(res, user, "User Registered Successfully", 200);

		} catch (error) {
			return res.status(400).json({ error: error.message });

		}

	},

	login: async (req, res) => {
		const { email, password }=req.body;
		try {
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

		} catch (error) {
			console.log(error)
			return res.status(500).json({ error: error.message });
		}

	},

	profile: async (req, res) => {
		const userId=req.user._id;
		try {
			const user=await User.findById(userId).select("-password");
			if (!user) {
				return res.status(400).json({ message: "User not found" });
			}
			return res.status(200).json({
				success: true,
				data: user,
			});

		} catch (error) {
			return res.status(400).json({ error: error.message });
		}

	},

	updateProfile: async (req, res) => {
		const userId=req.user._id;
		const { name, email }=req.body;
		try {
			const user=await User.findById(userId);
			if (!user) {
				return res.status(400).json({ message: "User not found" });
			}

			if (name) user.name=name;
			if (email) user.email=email;

			await user.save();
			return res.status(200).json({
				user,
				message: "Profile updated successfully"
			});
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},

	changePassword: async (req, res) => {
		const userId=req.user._id;
		const { oldPassword, newPassword }=req.body;
		try {
			if (!oldPassword||!newPassword) {
				return res.status(400).json({ message: "Please fill all fields" });
			}

			const user=await User.findById(userId).select("+password");
			const isMatch=await user.comparePassword(oldPassword);
			if (!isMatch) {
				return res.status(400).json({ message: "Old password is incorrect" });
			}
			user.password=newPassword;
			await user.save();
			return res.status(200).json({
				user,
				message: "Password changed successfully"
			})
		} catch (error) {
			return res.status(400).json({ error: error.message });

		}
	},

	forgotPassword: async (req, res) => {
		const { email }=req.body;
		if (!email) {
			return res.status(400).json({ message: "Please provide email" });
		}
		try {
			const user=await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ message: "User not found" });
			}
			user.resetToken=code;
			user.resetTokenExpire=Date.now()+3600000;
			await user.save();

			const subject="Reset Password";
			const html=`<div>
				<h3>Password Reset Request Received for the email <span style="color:blue">${user.email}</span></h3>
				<p>Please avoid this if you did not make a password reset request</p>
				<p>If you have requested the password reset, then please use the 4-Digit code below</p>
				<h1 style="text-align:center; color:grey">Code: ${code}</h1>
				<hr>
				<h3 style="color:red">This will expire in 30 minutes</h3>
			</div>`;

			// Send the email with the code
			await sendEmail({ email: user.email, subject, message: html });

			// Respond to the client indicating that the email has been sent
			res.status(200).json({ message: "Password reset code sent to your email." });

		} catch (error) {
			return res.status(400).json({ error: error.message });
		}


	},

	resetPassword: async (req, res) => {
		const { code, password }=req.body;
		try {
			if (!code||!password) {
				return res.status(400).json({ message: "Please fill all fields" });
			}
			const user=await User.findOne({ resetToken: code }).select('+password');
			if (!user) {
				return res.status(400).json({ message: "Invalid code or code was expired" });
			}
			user.password=password;
			await user.save();
			return res.status(200).json({
				user,
				message: "Password changed successfully"
			})
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	},

	addToPlaylist: async (req, res) => {
		const courseId=req.params.id;
		const userId=req.user._id;
		try {
			const user=await User.findById(userId)
			if (!user) {
				return res.status(400).json({ message: "User not found" });
			}
			const course=await Course.findById(courseId);
			if (!course) {
				return res.status(400).json({ message: "Course not found" });
			}

			user.playlist.push({
				course: course._id,
				poster: course.poster.url,
			})
			await user.save();
			return res.status(200).json({
				message: "Playlist added successfully"
			})

		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	},

	removeFromPlaylist: async (req, res) => {
		const courseId=req.params.id;
		const userId=req.user._id;
		try {
			const user=await User.findById(userId)
			if (!user) {
				return res.status(400).json({ message: "User not found" });
			}
			const course=await Course.findById(courseId);
			if (!course) {
				return res.status(400).json({ message: "Course not found" });
			}
			const courseIndex=user.playlist.findIndex(
				(item) => item.course.toString()===course._id.toString()
			);
			if (courseIndex===-1) {
				return res.status(400).json({ message: "Course not found in the playlist" });
			}
			user.playlist.splice(courseIndex, 1);

			await user.save();
			return res.status(200).json({
				message: "Course removed from the playlist successfully",
			});
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	},

	uploadSingleImageHandler: async (req, res) => {
		try {
			uploadSingleFile(req, res, async function (err) {
				if (err) {
					return res.status(400).json({
						success: false,
						message: "Image upload failed",
						error: err.message,
					});
				}

				try {
					if (!req.file) {
						return res.status(400).json({
							success: false,
							message: "No image selected",
						});
					}

					const imageBuffer=req.file.buffer;

					try {
						const uploadStream=cloudinaryV2.uploader.upload_stream(
							{
								resource_type: "auto",
								type: "authenticated",
								use_filename: true,
							},
							(error, result) => {
								if (error) {
									console.error(error);
									return res.status(500).json({
										success: false,
										message: "Image upload to Cloudinary failed",
										error: error.message,
									});
								}

								if (result&&result.secure_url) {
									const imageUrl=result.secure_url;
									return res.json({
										success: true,
										message: "Image uploaded successfully",
										image: imageUrl,
									});
								} else {
									return res.status(500).json({
										success: false,
										message: "Image upload to Cloudinary failed",
										error: "No secure_url in the result object",
									});
								}
							}
						);

						const bufferStream=streamifier.createReadStream(imageBuffer);
						bufferStream.pipe(uploadStream);
					} catch (error) {
						console.error(error);
						return res.status(500).json({
							success: false,
							message: "Image upload to Cloudinary failed",
							error: error.message,
						});
					}
				} catch (err) {
					console.error(err);
					return res.status(400).json({
						success: false,
						message: "Image upload failed",
						error: err.message,
					});
				}
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Image upload failed",
				error: error.message,
			});
		}
	},


};
