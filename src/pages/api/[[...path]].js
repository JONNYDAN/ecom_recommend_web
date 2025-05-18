// pages/api/[[...path]].js
// proxy

import { getToken } from "@/utils/storageUtils";
import axios from "axios";
import querystring from "querystring";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function handler(req, res) {
  console.log("[api]/proxy ~ api:", req.method, req.url);

  const { path, ...restQuery } = req.query;
  const query = querystring.stringify(restQuery);
  const backendUrl = `${API_BASE_URL}/api/${path.join("/")}?${query}`;
  const token = getToken({ req });

  try {
    const axiosInstance = axios.create({
      baseURL: backendUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Forward the original request data (body, method, etc.) to the backend
    const response = await axiosInstance.request({
      method: req.method, // Preserve the original HTTP method
      data: req.body, // Forward the request body to the backend
    });

    // Check if the response is a ZIP file
    if (response.headers["content-type"] === "application/zip") {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="download.zip"'
      );
      // Additional headers like Content-Length could also be set here if available
      res.status(response.status);
      res.send(response.data);
    } else {
      // Handle other content types as JSON
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.log("[api]/proxy ~ error:", error.message);
    res.status(500).json({
      error: error.message || "An error occurred while proxying the request.",
    });
  }
}
