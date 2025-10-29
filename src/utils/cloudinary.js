import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // localFilePath, which is the path of the file stored temporarily on your server.
        //uploading file to cloudinary
        const response  = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto" //Cloudinary will automatically detect the file type (image, video, PDF, etc.),
        })
        // // file has been uploaded successfully.
        // console.log("file uploaded to cloudinary successfully",
        // response.url, response.public_id);
        fs.unlinkSync(localFilePath); 
        //deleting the locally saved temporary file as the upload operation got failed.
        return response;
    }
    catch(error)
    {
        fs.unlinkSync(localFilePath); 
        //deleting the locally saved temporary file as the upload operation got failed.
        return null;
    }   
}


export { uploadOnCloudinary };
// This function uploads a file from your server to Cloudinary.
// It takes the local file path as input and returns the Cloudinary response (like URL, public ID) if successful.
// If the upload fails, it deletes the temporary file and returns null.