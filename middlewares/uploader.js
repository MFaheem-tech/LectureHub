import multer from 'multer';
import { v2 as cloudinaryV2 } from "cloudinary";

cloudinaryV2.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

const storage=multer.memoryStorage();

const uploadSingleFile=multer({
	storage: storage,
	limits: { fileSize: 2*1024*1024*1024 }, // 2 GB
}).single("file");

const uploadMultipleFiles=multer({
	storage: storage,
	limits: { fileSize: 2*1024*1024*1024 }, // 2 GB
}).array('files', 10)


export { uploadSingleFile, uploadMultipleFiles }

