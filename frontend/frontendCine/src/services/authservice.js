import axios from "axios";

const API = "http://localhost:8000/api";

export const login = async (correo, password) => {
  const response = await axios.post(`${API}/auth/login/`, {
    correo,
    password,
  });

  return response.data;
};