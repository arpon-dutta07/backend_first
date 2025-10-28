import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"


const registerUser = asyncHandler (async (req, res) =>
// get user details from frontend
// validation of email , not empty
// check if user already exist username or email
// chceck for images and check for avatar
// upload to cloudinary.. check avatar
// create user object
// create entry in db
// remove password and refresh token feild from response
// return response


{
// req.body contains that data.
// This line destructures the object, meaning it picks out those keys from req.body and saves them in variables:
    const {fullName, email, username , password} = req.body
    console.log("email:-", email);

    if ([fullName, email, username , password]. some((field) =>
    field?.trim()=== ""))
    // This creates an array containing all the input values.
    // .some() → built-in JavaScript array method that returns:
    // ✅ true if at least one element matches the condition
    // ❌ false if none match
    // field?.trim() 
    // field is one of the values (like fullName, email, etc.
    // ?. (optional chaining) prevents errors if field is undefined or nul
    // .trim() removes any spaces before or after the text.
    // So " " (just spaces) becomes "" (empty string).
    {
        throw new ApiError(400, "all feilds are required")
        // If any field is empty, this stops the code execution immediately and throws an error.
        // ApiError is usually a custom error class used in your project to handle errors neatly.
    }


})

export {registerUser};