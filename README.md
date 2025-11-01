# Backend API

A robust backend API built with Node.js, Express, and MongoDB for a video streaming platform. This project provides comprehensive user authentication, video management, and subscription features.

## Features

- **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **User Management**: User registration, login, logout, and profile management
- **File Uploads**: Support for avatar and cover image uploads using Cloudinary
- **Video Platform**: Video upload, management, and watch history tracking
- **Subscriptions**: User subscription system for content creators
- **Security**: Password hashing with bcrypt, CORS protection, and secure cookie handling

## Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary
- **Password Hashing**: bcrypt
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account for file storage

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=8000
   CORS_ORIGIN=http://localhost:3000
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on the port specified in your `.env` file (default: 8000).

## API Endpoints

### User Routes
- `POST /api/v1/users/register` - Register a new user (with avatar and cover image upload)
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout (requires authentication)
- `POST /api/v1/users/refresh-token` - Refresh access token

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── db/             # Database connection
│   ├── middlewares/    # Custom middleware (auth, multer)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── app.js          # Express app configuration
│   ├── constants.js    # Application constants
│   └── index.js        # Server entry point
├── public/             # Static files
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Arpon**