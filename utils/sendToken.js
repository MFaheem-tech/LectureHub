export const sendToken=(res, user, message, statusCode=200) => {
	const token=user.generateJwtToken();
	return res.status(statusCode).json({
		token,
		user,
		success: true,
		message,
	});
}
