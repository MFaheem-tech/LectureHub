import express from 'express';
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import { connectDb } from './config/db.js';
import { config } from 'dotenv';
config();


// ####### Swagger
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument=YAML.load("./swagger.yaml");

const options={
	customCss: ".swagger-ui .topbar { display: none }",
	customSiteTitle: "LectureHub",
};

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ######   Serve swagger Ui
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, options)
);



app.use('/api/v1/users', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/admin', adminRouter);

app.get('/', (req, res) => {
	return res.status(200).json('Api is working');
});


connectDb();

const PORT=process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`)
})
