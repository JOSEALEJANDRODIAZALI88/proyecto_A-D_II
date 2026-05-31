import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getUsuarios = async () => {
  const response = await axios.get(`${API_URL}/usuarios/`, {
    headers: getHeaders(),
  });

  return response.data;
};

export const getUsuarioById = async (id) => {
  const response = await axios.get(`${API_URL}/usuarios/${id}/`, {
    headers: getHeaders(),
  });

  return response.data;
};

export const createUsuario = async (usuario) => {
  const response = await axios.post(`${API_URL}/usuarios/`, usuario, {
    headers: getHeaders(),
  });

  return response.data;
};

export const updateUsuario = async (id, usuario) => {
  const response = await axios.put(`${API_URL}/usuarios/${id}/`, usuario, {
    headers: getHeaders(),
  });

  return response.data;
};

export const deleteUsuario = async (id) => {
  const response = await axios.delete(`${API_URL}/usuarios/${id}/`, {
    headers: getHeaders(),
  });

  return response.data;
};