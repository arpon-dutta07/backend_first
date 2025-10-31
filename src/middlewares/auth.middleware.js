import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler( async(req, res, next)=>
{
try {
        // get token from cookies or headers
        // check if the user is authenticated 
        const token =req.cookies?.accessToken || req.header 
        ("Authorization")?.replace("Bearer ", "")
        
        if(!token)
        {
            throw new ApiError (401, "Not authorized, no token")
        }
        // if no token, throw error
    
    
        const decodedTokenjwt = jwt.verify(token, process.env.
        ACCESS_TOKEN_SECRET)
    // decode token and find user in db
    // ACCESS_TOKEN_SECRET is the secret key used to sign the token.
    
    
    
       const user = await User.findById(decodedTokenjwt._id).
        select ("-password -refreshtoken")
        // You previously decoded the JWT token,
        // Inside that token, _id property exists (the user’s id stored when token was created),
        // So we fetch the user whose id matches the _id in the token.
        //This is because while making the JWT, I have used underscore ID (_id) as the property name. in the file src/models/user.model.js
        // find user by id from token, exclude password and refresh token
        // "-password -refreshtoken" excludes these fields from the result.
    
        if (!user){
            throw new ApiError(401, "User not found")
        }
    
        req.user = user
        //we are using req instead of res because we want to
        // pass this information to the next middleware or route handler.
        // This allows us to access the user data in subsequent parts of our application.
        // The user object will contain the details of the authenticated user.
        // if we had used res.user = user,
        // it would not have been accessible in the next middlewares or route handlers.
        // By attaching it to req, you make it available throughout the request-response cycle.
        // attach user object to request for use in other middlewares/routes
        next()
        // proceed to next middleware or route handler
    
} catch (error) 
{
    throw new ApiError (401, error?.message || 
    "Invalid access token")   
}
})
