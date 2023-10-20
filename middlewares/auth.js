import Jwt from 'jsonwebtoken';
import User from '../models/user.js';


export const auth=(req, res) => {
	const { token }=req.cookies;
	console.log(token)
	if (token) {
		Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({
					success: false,
					message: "Invalid Token"
				})
			}
			else {
				User.findById(decoded.id, (err, user) => {
					if (err) {
						return res.status(401).json({
							success: false,
							message: "Invalid Token"
						})
					}
					else {
						req.user=user;
						next();
					}
				})
			}
		})
	}
}