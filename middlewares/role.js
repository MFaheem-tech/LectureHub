export const Admin=(req, res, next) => {

	if (req.user.role==='admin') {
		next();
	}
	return res.json({ message: 'Access Denied' })
}

export const User=(req, res, next) => {
	if (
		req.user.role==='user'
	) {
		return next();
	}
	return res.status(401).json({ error: 'Access denied' });
};
export const Teacher=(req, res, next) => {
	if (
		req.user.role==='teacher'
	) {
		return next();
	}
	return res.status(401).json({ error: 'Access denied' });
};