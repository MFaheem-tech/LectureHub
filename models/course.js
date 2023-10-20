import { Schema, model } from "mongoose";

const userSchema=new Schema({
	title: {
		type: String,
		required: [true, "Please enter course title"]
	},
	description: {
		type: String,
		required: [true, "Please enter course description"]
	},
	lectures: [{
		title: {
			type: String,
			required: [true, "Please enter lecture title"]
		},
		description: {
			type: String,
			required: [true, "Please enter lecture description"]
		},
		video: {
			publicId: {
				type: String,
				required: true
			},
			url: {
				type: String,
				required: true
			}
		}
	}
	],
	poster: {
		publicId: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	},
	views: {
		type: Number,
		default: 0
	},
	numOfVideos: {
		type: Number,
		default: 0
	},
	category: {
		type: String,
		required: [true, "Please enter course category"]
	},
	createdBy: {
		type: String,
		required: [true, "Please enter course creator name"]
	},
	createdOn: {
		type: Date,
		default: Date.now,
	}
});

const Course=model("Course", userSchema);
export default Course;