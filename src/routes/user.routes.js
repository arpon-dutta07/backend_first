import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getWatchHistory, registerUser, updateUserAccountDetails } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { updateUserAvatar } from "../controllers/user.controller.js";
import { updateCoverImage } from "../controllers/user.controller.js";
import { getUserChannelProfile } from "../controllers/user.controller.js";

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
router.route("/logout").post(verifyJWT,logoutUser);
//this route is for user logout
//logoutUser controller function will handle the logout logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file

router.route("/refresh-token").post(refreshAccessToken);
//this route is for refreshing access token
//refreshAccessToken controller function will handle the refresh token logic in the user.controller.js file

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
//this route is for changing user password
//changePasswordUser controller function will handle the change password logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file
//post is used to send data to the server

router.route("/current-user").get(verifyJWT, getCurrentUser);
//this route is for getting user profile
//getUserProfile controller function will handle the get user profile logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file
//get is used to fetch data from the server

router.route("/update-account").patch(verifyJWT, updateUserAccountDetails);
//this route is for updating user profile
//updateUserProfile controller function will handle the update user profile logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file
//patch is used to update data on the server

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
//this route is for updating user avatar
//upload.single("avatar") middleware handles the file upload for a single file under the field name "avatar".
//updateUserAvatar controller function will handle the update user avatar logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file

router.route("/coverImage").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
//this route is for updating user cover image
//upload.single("coverImage") middleware handles the file upload for a single file under the field name "coverImage".
//updateUserCoverImage controller function will handle the update user cover image logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
//this route is for getting user channel profile by username
//getUserChannelProfile controller function will handle the get user channel profile logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file
// /c/:username → :username is a route parameter that will be replaced with the actual username when making the request.

router.route("/history").get(verifyJWT, getWatchHistory);
//this route is for getting user watch history
//getWatchHistory controller function will handle the get user watch history logic in the user.controller.js file
//verifyJWT middleware ensures that only authenticated users can access this route in the auth.middleware.js file

export default router;