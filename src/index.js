import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";



// This line tells dotenv:
// 🗂️ “Hey, look inside the .env file and load all the environment variables (like MONGODB_URI, PORT, etc.) into process.env.”
dotenv.config({
  path: "./.env"
});




// You call the function to connect to MongoDB.
// This function returns a Promise, meaning it takes some time (because connecting to a database isn’t instant).
// So you use .then() and .catch() to handle what happens after it succeeds or fails.
connectDB()
.then(() => {
  // If the connection is successful, this code runs:
  // That means your app begins listening for web requests — like someone opening your site.
  const server = app.listen(process.env.PORT || 8000 , () => {
    console.log(`Server started on port ${process.env.PORT}`); 
  })
  server.on("error", (error)=>{
    console.error("ERROR_FOUND: ", error);
    throw error
  })

  // app.on("error", (error) => {...})
  // This line is meant to catch server errors.
  // But here’s the small mistake 👇
  // 👉 app (the Express object) doesn’t actually emit "error" events —
  // the real server created by app.listen() does.
  // So, this should be:
  // const server = app.listen(...);
  // server.on("error", (error) => {...});
  // Otherwise, this app.on("error") won’t really catch server errors.
  
})
.catch((error)=> {
  console.error("MongoDB Connection Error Found!!! ", error);
})












// This is one way where we, in the index.js file only, we create the connection of our database and error handling 
// part of the database. This is one way or else we can do on our db folder we create another index.js and there we connect and 
// create a function and then we input that in the index.js that I have done above.


// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";

// const app = express();
// ( async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     console.log("Connected to MongoDB");
//     app.on("error", (error)=>{
//       console.error("SERVER_ERROR_FOUND: ", error);
//       throw error
//     })

//     app.listen(process.env.PORT, () => {
//       console.log(`Server started on port
//       ${process.env.PORT}`);
//     })
    
//   } catch (error) {
//     console.error("DB_ERROR_FOUND: ", error)
//     throw error
//   }
// }) 