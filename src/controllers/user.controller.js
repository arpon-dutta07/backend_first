import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse} from "../utils/ApiResponse.js"


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

// This code checks whether the user who’s trying to register already exists in the database.
// It ensures that:
// two people can’t have the same username, and
// two people can’t use the same email.


// User is your Mongoose model (the collection in MongoDB that stores user data).
// Example: User might represent a collection called users that looks like:

    const existedUser = await User.findOne({
//         $or: [{ username }, { email }] ?
// This is a MongoDB query operator.
    $or: [{ username }, { email }]
    });
// .findOne() searches the database for one document that matches your condition.
// If it finds one → it returns the user object.
// If it doesn’t find any → it returns null.
    if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
    // This condition says:
// “If the query found an existing user, then stop the signup process and throw an error.”
    }



    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //     | Part                         | Meaning                                                          |
    // | ---------------------------- | ---------------------------------------------------------------- |
    // | `req.files`                  | Object containing all uploaded files                             |
    // | `req.files?.avatar`          | Access the “avatar” field (array of uploaded avatar files)       |
    // | `req.files?.avatar[0]`       | The **first file** uploaded under the “avatar” name              |
    // | `req.files?.avatar[0]?.path` | The **file path** on your server (where it’s temporarily stored) |
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    //req.files
    //When a user uploads images (like an avatar or cover image),
    // you’re using Multer as a middleware through this code
    // The frontend form will send two files:
    // One under the name “avatar”
    // One under the name “coverImage”

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }


    // Now, upload these images to Cloudinary:
    // Upload the avatar image to Cloudinary
    // Upload the cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // uploadOnCloudinary is a function you created to handle uploading files to Cloudinary.
    // It takes the local file path as input and returns the Cloudinary response (like URL, public ID) if successful.

    const coverImage = await uploadOnCloudinary(coverImageLocalPath); 

    // Upload cover image only if it exists   
    if(!avatar){
        throw new ApiError(500, "Error in uploading avatar image. Please try again later.");
    }


    const user = await User.create ({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    // User.create() is a Mongoose method that creates a new user document in the database.
    // It takes an object with all the user details and saves it to the users collection.
    // avatar: avatar.url → saves the URL of the uploaded avatar image from Cloudinary.
    // coverImage: coverImage?.url || "" → saves the URL of the cover image if uploaded; otherwise, it saves an empty string.

    const createdUser = await User.findById(user._id)
    .select(
        "-password -refreshToken"
    )
    // User.findByIdAndUpdate(user._id) fetches the newly created user by their unique ID.
    // .select("-password -refreshToken") excludes the password and refreshToken fields from the returned user object for security reasons.
    
    if(!createdUser){
        throw new ApiError(500, "something went wrong while creating user. Please try again later.");
    }
    // This condition checks if, for some reason, the user creation failed and no user was returned.

    // Finally, send a success response back to the client:
    res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            createdUser
        )
    );
    // res.status(201) sets the HTTP status code to 201, which means “Created” — indicating that a new resource (user) has been successfully created.
    // .json(...) sends a JSON response back to the client.
    // new ApiResponse(...) creates a standardized response object using your ApiResponse class.
    
})

export {registerUser};