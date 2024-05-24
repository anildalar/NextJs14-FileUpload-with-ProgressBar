import { NextResponse } from "next/server";
import fs from "fs";
import path from "path"; // Import path module to work with file paths
import { pipeline } from "stream";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

const pump = promisify(pipeline);

/* export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
}; */
export const runtime = 'nodejs';


export async function POST(req, res) {
  try {
    const formData = await req.formData();
    const videoData = formData.get("video");
    const imageData = formData.get("image");
    if(imageData){
      const fileExtension = path.extname(imageData.name); // Extract file extension
      const uniqueId = uuidv4();
      const filePath = `./uploads/images/${uniqueId}-file${fileExtension}`; // Append extension to file name
  
      await pump(imageData.stream(), fs.createWriteStream(filePath));
  
      return NextResponse.json({ status: "success", data: { size: imageData.size, path: filePath } });
    }
    if(videoData){
      const fileExtension = path.extname(videoData.name); // Extract file extension
      const uniqueId = uuidv4();
      const filePath = `./uploads/videos/${uniqueId}-file${fileExtension}`; // Append extension to file name
  
      await pump(videoData.stream(), fs.createWriteStream(filePath));
  
      return NextResponse.json({ status: "success", data: { size: videoData.size, path: filePath } });
    }
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e.message });
  }
}
