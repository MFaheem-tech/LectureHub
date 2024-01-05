import { Schema, model } from "mongoose";

const courseSchema=new Schema({
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
			type: String,
		},
	}],
	coverImage: String,
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
		type: Schema.Types.ObjectId,
		ref: "User"
	}
}, { timestamps: true });

const Course=model("Course", courseSchema);
export default Course;
