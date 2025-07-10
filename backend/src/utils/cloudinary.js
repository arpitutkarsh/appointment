import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //it will be used for file handling

cloudinary.config({
    cloud_name: 'daga0ry6c',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log(process.env.CLOUDINARY_API_SECRET)
//To uopload the file what we will do is, first we will store the file in our local server/storage then will upload to cloudinary and then we will delete the file from our local storage
const uploadonCloudinary = async (localFilePath) => {
  try {
    console.log('Cloudinary',process.env.CLOUDINARY_API_SECRET)
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); // cleaning up the file after uploading
    return response;
  } catch (error) {
    console.error("🚨 Cloudinary Upload Error:", error); // 👈 THIS IS IMPORTANT
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); //deleting the file after upload fails
    }
    return null;
  }
};


export {uploadonCloudinary};