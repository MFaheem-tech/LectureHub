import Jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();


export const auth=async (req, res, next) => {
	const { headers }=req;
	const token=headers.authorization? headers.authorization.split(' ')[1]:null;
	if (!token) {
		return res.status(400).json({ message: "Please provide bearer token" });
	}
	try {
		const decoded=Jwt.verify(token, process.env.JWT_SECRET);
		req.user=decoded;
		next();
	} catch (error) {
		return res.status(400).json({ message: "Invalid token" });
	}
};


