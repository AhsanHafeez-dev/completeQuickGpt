
import OpenAI from "openai";

import {v2 as cloudinary } from 'cloudinary'
import { ApiError } from "./ApiError.js";
import { httpCodes } from "../constants.js";
// 1. Initialize ImageKit
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const openai = new OpenAI({
  apiKey: "AIzaSyD2jjMe2VjtREWdFNbnTfiZ1GYuwIit0WA",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function generateAndUpload(prompt) {
  try {
    // 2. Generate the image in Base64
    const response = await openai.images.generate({
      model: "imagen-4.0-fast-generate-001",
      prompt,
      response_format: "b64_json",
    });

    const base64Image = response.data[0].b64_json;
    console.log("got image atleats");
    
      const url = await upload(`data:image/png;base64,${base64Image}`);
      console.log("Image successfully uploaded to ImageKit!");
    console.log("URL:", url);

    return url;
  } catch (error) {
    console.error("Upload failed:");
  }
}


const upload = async (base64Url) => {

    try { const response = await cloudinary.uploader.upload(base64Url, { folder: "qucikGpt", resource_type: "auto" }); return response.secure_url; }
    catch (err) {
        console.log(err.toString());
        throw new ApiError(httpCodes.serverSideError, "somkhjdsd");
    }
  
}


export { generateAndUpload, upload };