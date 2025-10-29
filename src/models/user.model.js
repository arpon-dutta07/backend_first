import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        avatar: {
            type: String,  // cloudinary url
            required: true,
        },

        coverImage: {
            type: String,   // cloudinary url
        },

        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],

        password: {
            type: String,
            required: [true, "password is required"]
        },
        refreshToken: {
            type: String,
        }
    },

    { 
        timestamps: true
    }
);

// “Before saving a user to the database, make sure the password is safely encrypted 
// (hashed) instead of storing it as plain text.”

// userSchema.pre("save", ...)
// 👉 means “Run this function before (pre) the user data is saved to the database.”
// "save" → refers to the action when you call .save() or .create() for a user.
// The second part, async function (next) {...}, is the function that will run before saving.

userSchema.pre("save", async function (next) {
    if(!this.isModified('password')) return next();          // if password not changed, skip
// this here refers to the current user document being saved (for example, { username: 'arpon', password: '12345' }).
// this.isModified('password') checks if the password field has been changed or added.
// “If the password was NOT modified, skip the hashing step and move on.”
// return next(); → simply means “go to the next step, save the user.”
    this.password = await bcrypt.hash(this.passsword,10)          // hash password
// We use the bcrypt library — a tool for encrypting passwords securely.
// bcrypt.hash(this.password, 10) takes two things:
// the plain text password (like "12345")
// and a “salt round” value (10 → how strong the encryption is)
    next()    // continue saving
})



userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
// bcrypt.compare(password, this.password) checks if the provided password matches the hashed password stored in the database.
}

// userSchema.methods → lets you add custom functions to all user objects created from this schema.
// jwt.sign() is a function that creates a token using:
// Data you want to include inside the token (payload)
// A secret key to lock it (so no one can fake it)
// Optional settings like expiry time
// This is the payload — the information you’re storing inside the token.
// _id, email, username, fullName → come from the user’s data.
// this → refers to the specific user calling this function.
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            // This sets how long the token is valid — for example 1d 
            // (1 day), which also comes from your .env file.
        }
    )
}
userSchema.methods.generateRefreshToken = function() {
return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            // This sets how long the token is valid — for example 1d 
            // (1 day), which also comes from your .env file.
        }
    )
}
// These methods will create JWT tokens for the user.
// Access tokens are short-lived tokens used for authentication.
// Refresh tokens are long-lived tokens used to obtain new access tokens when they expire.

export const User = mongoose.model("User", userSchema); 