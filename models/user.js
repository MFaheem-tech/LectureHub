import { Schema, model } from "mongoose";
import validater from 'validator';
import Jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs'

const userSchema=new Schema({

	name: {
		type: String,
		required: [true, 'Please enter your name']
	},
	email: {
		type: String,
		required: [true, "Please enter your email"],
		unique: true,
		validate: validater.isEmail,
	},
	password: {
		type: String,
		required: [true, "Please enter your password"],
		min: 6,
		select: false,
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
	subscription: {
		id: String,
		status: String,
	},
	avatar: {
		publicId: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	},
	resetToken: {
		type: String,
		required: false
	},
	resetTokenExpire: {
		type: Date,
		required: false
	},
	playlist: [
		{
			course: {
				type: Schema.Types.ObjectId,
				ref: "Course"
			},
			poster: String,
		},

	]

}, { timestamps: true })


userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password=await bcryptjs.hash(this.password, 10),
		next();

});

userSchema.methods.generateJwtToken=function () {
	const token=Jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
		expiresIn: "15d"
	});
	return token;
}
userSchema.methods.comparePassword=async function (password) {
	return await bcryptjs.compare(password, this.password);
}

const User=model("User", userSchema);
export default User;