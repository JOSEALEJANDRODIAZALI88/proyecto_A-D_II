import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth";

export const login = async (correo, password) => {
  const response = await axios.post(`${API_URL}/login/`, {
    correo,
    password,
    contrasena: password,
  });

  return response.data;
};

export const register = async (data) => {
  const response = await axios.post(`${API_URL}/register/`, {
    nombre: data.nombre,
    correo: data.correo,
    telefono: data.telefono,
    password: data.password,
    contrasena: data.password,
  });

  return response.data;
};

export const sendRecoveryCode = async (correo) => {
  const response = await axios.post(`${API_URL}/recover-password/send-code/`, {
    correo,
  });

  return response.data;
};

export const verifyRecoveryCode = async (correo, codigo) => {
  const response = await axios.post(`${API_URL}/recover-password/verify-code/`, {
    correo,
    codigo,
  });

  return response.data;
};

export const resetPasswordWithCode = async (correo, codigo, password) => {
  const response = await axios.post(`${API_URL}/recover-password/reset/`, {
    correo,
    codigo,
    password,
    contrasena: password,
  });

  return response.data;
};

export const recoverPassword = async (correo, password) => {
  const response = await axios.post(`${API_URL}/recover-password/reset/`, {
    correo,
    password,
    contrasena: password,
  });

  return response.data;
};

export const registerWithGoogle = async (credential) => {
  const response = await axios.post(`${API_URL}/google/`, {
    credential,
  });

  return response.data;
};