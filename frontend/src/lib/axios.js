import axios from "axios";

let apiURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

// Ensure the API URL ends with /api/v1
if (apiURL && !apiURL.replace(/\/$/, "").endsWith("/api/v1")) {
  apiURL = apiURL.replace(/\/$/, "") + "/api/v1";
}

export const axiosInstance = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});
