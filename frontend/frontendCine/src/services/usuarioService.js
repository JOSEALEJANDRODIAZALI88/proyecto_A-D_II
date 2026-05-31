import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth";

export const getUsuarios = async () => {
  const response = await axios.get(`${API_URL}/usuarios/`);
  return response.data;
};

export const getUsuarioById = async (id) => {
  const response = await axios.get(`${API_URL}/usuarios/${id}/`);
  return response.data;
};

export const createUsuario = async (usuario) => {
  const response = await axios.post(`${API_URL}/usuarios/`, usuario);
  return response.data;
};

export const updateUsuario = async (id, usuario) => {
  const response = await axios.put(`${API_URL}/usuarios/${id}/`, usuario);
  return response.data;
};

export const deleteUsuario = async (id) => {
  const response = await axios.delete(`${API_URL}/usuarios/${id}/`);
  return response.data;
};