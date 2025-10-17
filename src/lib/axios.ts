import axios from "axios";
import API_BASE_URL from "@/utils/constant";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
});

export default axiosInstance;
