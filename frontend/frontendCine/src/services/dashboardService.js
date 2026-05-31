import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth";

export const getDashboardData = async () => {
  const response = await axios.get(`${API_URL}/dashboard/`);
  return response.data;
};