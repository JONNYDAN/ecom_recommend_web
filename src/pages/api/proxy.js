import axios from "axios";
import querystring from "querystring";
// pages/api/proxy.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiMapping = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  getGroupCategories: "/api/exam/group-categories",
  searchCourses: "/api/exam/courses",
  getCourseById: "/api/exam/courses",
};

// this api proxy is used to bypass the CORS policy temporarily
export default async function handler(req, res) {
  console.log("[api]/proxy ~ api:", req.method, req.query.api, req.query);

  const method = req.method.toLowerCase();
  try {
    const response = await axios[method](
      `${API_BASE_URL}${apiMapping[req.query.api]}${
        req.query.id ? `/${req.query.id}` : ""
      }?${querystring.stringify(req.query)}`,
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.log("[api]/proxy ~ error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while proxying the request." });
  }
}
