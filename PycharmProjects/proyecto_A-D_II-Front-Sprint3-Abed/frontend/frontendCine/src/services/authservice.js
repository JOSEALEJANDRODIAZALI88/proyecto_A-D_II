import axios from "axios";

const API = "http://localhost:8000/api";

export const login = async (correo, password) => {
  const response = await axios.post(`${API}/auth/login/`, {
    correo,
    password,
  });

  return response.data;
};

export const registerUser = async (nombre, correo, telefono, password) => {
  const response = await axios.post(`${API}/auth/register/`, {
    nombre,
    correo,
    telefono,
    password,
  });

  return response.data;
};

export const recoverPassword = async (correo, password) => {
  const response = await axios.post(`${API}/auth/recover-password/`, {
    correo,
    password,
  });

  return response.data;
};