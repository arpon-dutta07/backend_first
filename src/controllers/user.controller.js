import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";



const generateAccessAndRefreshTokens = async (userId) => {
    //userId is the id of the user whose tokens we want to generate  
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})
    // Here, we save the refresh token to the user document in the database.
    // validateBeforeSave: false → skips any validation checks defined in the User schema
    
    return { accessToken, refreshToken }
    //returning both tokens as an object to the frontend


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}
// This function generates access and refresh tokens for a user based on their userId.
// It retrieves the user from the database using the provided userId,
// then calls methods on the user object to create the tokens.
// If any error occurs during this process, it throws an ApiError with a 500 status code.






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
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    //req.files
    //When a user uploads images (like an avatar or cover image),
    // you’re using Multer as a middleware through this code
    // The frontend form will send two files:
    // One under the name “avatar”
    // One under the name “coverImage”

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage)
        && req.files.coverImage.length > 0) 
    {
    
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    // This code safely checks if a cover image was uploaded.
    // If it was, it retrieves the local file path where Multer stored it temporarily on your server.
    // If there’s no cover image uploaded, it simply skips this part.


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    // This condition checks if the avatar image was uploaded.
    // If not, it throws an error because the avatar is mandatory for registration.






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


    // User.create() is a Mongoose method that creates a new user document in the database.
    const user = await User.create ({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
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


const loginUser = asyncHandler (async (req, res) =>{
// get email and password from req.body
// login with username or email
// find the user in db
// if user not found throw error
// if user found, compare password check password
// send cookie with jwt token

    const {email, username, password} = req.body
// This line extracts email, username, and password from the request body sent by the client during login.
    if(!email && !username)
    {
        throw new ApiError(400, "email or username is required to login");
    }
    // This condition checks if neither email nor username is provided.
    // If both are missing, it throws an error indicating that at least one is required for login.



    // Find the user in the database using either email or username
    const user = await User.findOne(
    {
        $or: [{email}, {username}]
    })
    // $or operator allows searching for a user by either email or username.
    // If a user with either the provided email or username exists, it will be returned.

    if(!user){
        throw new ApiError(404, "User not found with this email or username");
    }
    // This code uses the findOne() method to search for a user in the database based on either their email or username.
    // If no user is found, it throws an error saying “User not found”.


    const isPasswordValid = await user.isPasswordCorrect(password)
    // ispasswordCorrect(password) is a method defined in your User model that checks if the provided password matches the stored hashed password.
    // It returns true if the password is correct, otherwise false.

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password. Please try again.");
    }
    // This condition checks if the provided password is correct.
    // If not, it throws an error indicating that the password is invalid.

    const {accessToken, refreshToken} = await 
    generateAccessAndRefreshTokens(user._id)
    // This line calls the generateAccessAndRefreshTokens function (defined earlier) to create new JWT access and refresh tokens for the authenticated user.
    // It passes the user’s unique ID (user._id) to generate the tokens.

     const loggedInUser = await User.findById(user._id)
     .select(
        "-password -refreshToken"
    )
    // loggedInUser is fetched from the database using findBy)
    // .select("-password -refreshToken") excludes the password and refreshToken fields from the returned user object for security reasons.
    // This ensures that sensitive information is not sent back to the client.


    //cookie options

    const options = {
        httpOnly: true,
        secure: true,
    }
    // These options configure how cookies should behave when sending JWT tokens.
    // httpOnly: true → makes sure the cookie cannot be accessed via JavaScript (prevents XSS attacks).
    // secure: true → ensures the cookie is only sent over HTTPS connections (for added security).

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
        {
            user: loggedInUser, accessToken, refreshToken
            // building the JSON response body that will be sent to the frontend.
            // This is the actual data being sent back to the client upon successful login.
            //user → send the logged-in user's data
            // accessToken → send the access token
            // refreshToken → send the refresh token
        },
        "User logged in successfully"
        )
    )
    // This code sets two cookies in the response:
    // accessToken cookie contains the JWT access token.
    // refreshToken cookie contains the JWT refresh token.
    // Both cookies use the options defined earlier for security.


// STEP 1: .status(200)
// This just sets the HTTP status code of the response.
// Think of it like writing on the envelope:
// "Hey browser, this request was successful (200)".
// 🧠 It doesn’t send anything yet — it just sets a label.
// 🧩 STEP 2: .cookie("accessToken", accessToken, options)
// Now this adds cookies to the same response object.
// 👉 It’s like saying:
// “Okay response, also attach this cookie before sending.”
// It’s still the same single response, you’re just adding extra things to it (like toppings on a pizza 🍕).
// Where this cookie is stored:
// When the browser receives the response:
// It checks if there are any cookies
// If yes → it stores them automatically in the browser’s “Cookies storage”
// 📍You can see them in:
// Developer Tools → Application → Cookies
// So cookies are stored in the browser, not in your backend.

// STEP 3: .json(...)
// This is the final step — it sends the whole response (with status, cookies, and JSON body) back to the browser.
// So:
// .status(200) → sets success code ✅
// .cookie(...) → attaches tokens ✅
// .json(...) → sends data ✅
//this is send to the frontend.

})




const logoutUser = asyncHandler (async (req, res) =>
// clear cookies from frontend
// delete refresh token from db
// send response
{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:
            {
                refreshToken: undefined
            }
        },
        {
            new: true,
            //new: true tells Mongoose: “Return the updated document instead of the old one.”
        }
    )
    // This code finds the user in the database by their unique ID (req.user._id) and updates their document.
    // $set: { refreshToken: undefined } → This part sets the refreshToken field to undefined, effectively deleting it from the user’s document.
    // This is important for security — it ensures that the refresh token can no longer be used to get new access tokens after logout.
    // { new: true } → This option tells Mongoose to return the updated user document after the change is made.
    // However, in this case, we’re not using the returned document; we just want to perform the update.



    // Clear the cookies from the client
    const options = {
        httpOnly: true,
        secure: true,
    }
    // These options configure how cookies should behave when sending JWT tokens.
    // httpOnly: true → makes sure the cookie cannot be accessed via JavaScript (prevents XSS attacks).
    // secure: true → ensures the cookie is only sent over HTTPS connections (for added security).
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,"User logged out successfully"));
    // This code clears the accessToken and refreshToken cookies from the client’s browser.
    // .clearCookie(...) removes the specified cookie.
    // Finally, it sends a JSON response back to the client indicating that the user has been logged out successfully.
    // options are passed to ensure the cookies are removed securely.
    // options mean that the cookies will be cleared with the same security settings as when they were set.
});




const refreshAccessToken = asyncHandler (async (req, res) =>
{
    // get refresh token from cookies
    // verify refresh token
    // generate new access token
    // generate new refresh token
    // save refresh token in db
    // send response

    const incomingRefreshToken = req.cookies.refreshToken 
    || req.body.refreshAccessToken

    // This line tries to get the refresh token from two places:
    // 1. From the cookies sent with the request (req.cookies.refreshToken)
    // 2. From the request body (req.body.refreshAccessToken)
    // It uses the logical OR operator (||) to check both places.
    // If the token is found in cookies, it uses that; otherwise, it checks the request body.

    if(!incomingRefreshToken)
    {
        throw new ApiError (401, "Unauthorized request")
    }

try {
    
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        // This line verifies the incoming refresh token using the secret key stored in environment variables.
        // If the verification fails, it throws an error.
        jwt.verify
        (incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
    
        const user = await User.findById (decodedToken?._id)
        // This line fetches the user from the database using the user ID (_id) extracted from the decoded refresh token.
        if(!user)
        {
            throw new ApiError (401, "Invalid refresh token")
        }
        // This condition checks if a user was found in the database.
        // If no user is found, it throws an error indicating that the refresh token is invalid.    
    
    
        if(incomingRefreshToken !== user?.refreshToken)
        {
            throw new ApiError (401, "Refresh token expired")
        }
        // This condition compares the incoming refresh token with the one stored in the user’s document.
        // If they don’t match, it throws an error indicating that the refresh token is invalid.
    
    
        // Generate new access and refresh tokens
        const options = 
        {
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
        // const {accessToken, refreshToken} mesns that we are destructuring the object returned by the function generateAccessAndRefreshTokens.
        // const {accessToken, refreshToken} = {...}
        // This syntax is known as object destructuring.
        // It allows us to extract properties directly into separate variables.
        // In this case, it’s extracting accessToken and refreshToken from the result of generateAccessAndRefreshTokens(user._id).
        // This line generates new access and refresh tokens for the user.
        // It’s likely calling another function (generateAccessAndRefreshTokens) to do this.
    
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)        
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
            { accessToken, refreshtoken: newRefreshToken },
            "Access token refreshed successfully"
            )
        );
        // This code sets two cookies in the response:
        // accessToken cookie contains the new JWT access token.
        // refreshToken cookie contains the new JWT refresh token.
        // Both cookies use the options defined earlier for security.
    
    
} catch (error) {
    throw new ApiError (401, error?.message || "Invalid refresh token")
    
}


})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};