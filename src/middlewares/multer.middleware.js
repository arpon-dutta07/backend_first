import multer from "multer";

// User uploads a file → goes from frontend → Express backend.
// Multer catches the file and saves it temporarily on your server.
// Then you can use your Cloudinary upload function (the one from before) to send it to the cloud.
// Finally, you delete the temporary file.

const storage = multer.diskStorage({
// This tells multer to save the uploaded files on your computer’s disk (locally), not just in memory.
// It takes an object with two keys:
// destination and filename.
    destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
// cb = callback function that tells multer where to store the file.
// The first argument (null) means “no error”.
// "./public/temp" is the folder path where files are temporarily saved.
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
// This defines the name under which the file will be saved locally.
// file.originalname is the name the user had on their computer (like mypic.png).
// You can also customize this (for example, add timestamps or unique IDs) to avoid overwriting files.
})

export const upload = multer({ 
    storage,
})
// This creates the multer middleware using the storage settings defined above.
// You can now use this upload middleware in your routes to handle file uploads.
