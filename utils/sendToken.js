export const sendToken=(res, user, message, statusCode=200) => {
	const token=user.generateJwtToken();

	const options={
		expires: new Date(Date.now()+15*24*60*60*1000),
		httpOnly: true,
	};
	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		message,
		token
	})
}