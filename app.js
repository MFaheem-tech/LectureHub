import express from 'express';
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/db.js';
import { config } from 'dotenv';
config();

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());



app.use('/api/v1/users', userRouter);
app.use('/api/v1/course', courseRouter);

app.get('/', (req, res) => {
	return res.status(200).json('Api is working');
});


connectDb();

const PORT=process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`)
})
