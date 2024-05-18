import { NextResponse } from "next/server";
import fs from "fs";
import path from "path"; // Import path module to work with file paths
import { pipeline } from "stream";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

const pump = promisify(pipeline);

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

const uploadDir = "./uploads/video/"; // Directory to store uploaded files

export async function POST(req, res) {
  try {
    const formData = await req.formData();
    const file = formData.get("video");

    if (!file) {
      return NextResponse.json({ status: "fail", data: "No file uploaded" });
    }

    const fileExtension = path.extname(file.name); // Extract file extension
    const uniqueId = uuidv4();
    const filePath = `${uploadDir}/${uniqueId}-file${fileExtension}`; // Append extension to file name

    await pump(file.stream(), fs.createWriteStream(filePath));

    return NextResponse.json({ status: "success", data: { size: file.size, path: filePath } });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e.message });
  }
}
