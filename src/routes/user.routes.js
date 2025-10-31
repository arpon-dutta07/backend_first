import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
const router = Router();


router.route("/register").post(
// This upload is a middleware that we are using that I have written on the malta.middleware.js file.
// upload.fields() is the multer middleware that tells Express:
// “Expect two files — one under avatar and one under coverImage.”
// It allows up to 1 file for each field (maxCount: 1).
// After multer processes the files, it passes control to your main function → registerUser.
    upload.fields([
        {
            name: "avatar",
            maxcount: 1
        },
        {
            name: "coverImage",
            maxcount: 1
        }
    ]),
    registerUser)
    //this route is for user registration

router.route("/login").post(loginUser);
//this route is for user login
//loginUser controller function will handle the login logic in the user.controller.js file


//secured routes
router.route("/logout").post(
    verifyJWT,
    logoutUser);
//this route is for user logout
//logoutUser controller function will handle the logout logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file
router.route("/refresh-token").post(refreshAccessToken);

export default router;