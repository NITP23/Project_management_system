import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://project-management-system-3n7i.onrender.com/api/v1",
  withCredentials: true,
});
