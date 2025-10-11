import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
  path: "./.env"
});


connectDB();
















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