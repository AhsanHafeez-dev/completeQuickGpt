import { imageKit } from "../configs/imageKit.config.js";
import fs from 'fs';
import axios from "axios";
const generateImage = async (prompt) => {
    const encodedPrompt = encodeURIComponent(prompt);
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;
    console.log(generatedImageUrl);
    const imageBuffer = await axios.get(generatedImageUrl, { responseType: "arraybuffer" });
    console.log(imageBuffer);
    

    // Assuming your response object from Axios is called 'response'
    const bufferData = imageBuffer.data;

    fs.writeFile("downloaded_image.png", bufferData, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File successfully saved as downloaded_image.png");
      }
    });
    
    
    const base64Image = `data:image/png;base64,${Buffer.from(imageBuffer.data, "binary").toString('base64')}`;
    // const base64Image = Buffer.from(imageBuffer);
    return await saveImage(base64Image);
    
    
}



const saveImage = async (base64Image) => {
    const response = await imageKit.upload({
        file: base64Image,
        fileName: `${Date.now()}.png`,
        folder:"quickgpt"
    })

    return response.url;
}

export {generateImage,saveImage}