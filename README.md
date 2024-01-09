# LectureHub API

This project provides an API server for managing courses, user authentication, user profiles, and more using Node.js, Express, and MongoDB

## Features

- Course Management: Add, delete, update, and retrieve courses.
- User Authentication: Register, login, update profile, change password, and manage user sessions.
- Playlist Management: Add courses to the user's playlist and remove them.
- Image Upload: Upload images to the server using Cloudinary.
- Swagger Documentation: Explore and interact with the API using Swagger UI.

## Technologies Used

- Node.js
- Express
- MongoDB
- Cloudinary (for image upload)

## Libraries

- bcryptjs
- cors
- dotenv
- express-async-handler
- jsonwebtoken
- mongoose
- multer
- nodemailer
- streamifier
- swagger-jsdoc
- swagger-ui-express
- validator
- yamljs

## Setup

1. Clone the repository:

```
git clone https://github.com/your_username/LectureHub.git
```

2. Install dependencies:

```
cd your-repo
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/lectureHub
JWT_SECRET=
SMPT_HOST =

SMPT_PORT =

SMPT_SERVICE =

SMPT_USER =
SMPT_PASSWORD =
SMPT_MAIL =

CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

4. Start the server:

```
npm start
```

## API Documentation

- Explore the API endpoints and test them using Swagger UI. Start the server and visit http://localhost:8000/api-docs/ in your browser

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and submit a pull request.
