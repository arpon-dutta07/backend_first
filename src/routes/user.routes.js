import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"


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


export default router;