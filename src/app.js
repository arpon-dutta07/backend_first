import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()


// Normally, if your backend runs on
// http://localhost:8000
// and your frontend (React app) runs on
// http://localhost:3000,
// the browser blocks requests from 3000 → 8000 because they are on different origins (different ports).
// That’s called a cross-origin request.
// This line tells Express to use the CORS middleware.
// cors() is a function from the cors npm package.
// It sets special HTTP headers that say:
app.use(cors({
    origin: process.env.CORS_ORIGIN,
// origin: process.env.CORS_ORIGIN
// This defines which frontend URL is allowed to talk to your backend.
// For example, in your .env file, you might have:
// CORS_ORIGIN=https://myfrontend.vercel.app
// That means — only the website running on https://myfrontend.vercel.app can send API requests to your backend.
    credentials: true,
}))

app.use(express.json({limit: "20kb"}));
// This tells Express:
// “Whenever someone sends JSON data in a request, read it and make it available in req.body.”
// “If the request body is larger than 20 kilobytes, reject it.”

app.use(express.urlencoded({ extended: true, limit: "20kb" }));
// This line is for handling form submissions — like when you submit a regular HTML form (not JSON).
// Example HTML form:
// <form action="/contact" method="POST">
//   <input name="email" value="test@gmail.com">
//   <input name="message" value="Hello">
// </form>
// When this form is submitted, Express can read the data thanks to this line.
// extended: true → allows nested objects, e.g. { user: { name: "Arpon" } }
// limit: "20kb" → again, protects against large payloads.

app.use(express.static("public"));
// This serves static files — files that don’t change, such as:
// images, CSS files, JavaScript files, PDFs, icons, etc.
// You can access logo.png in your browser at:
// “Make everything inside the public folder available publicly.”

app.use(cookieParser());
// This middleware parses cookies from incoming requests.
// After this, you can access cookies via req.cookies in your route handlers.


// routes importing 

import userRouter from "./routes/user.routes.js";


//routes declaration 
app.use("/api/v1/users", userRouter);


export default app;