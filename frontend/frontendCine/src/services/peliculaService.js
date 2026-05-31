import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const buildFormData = (pelicula) => {
  const formData = new FormData();

  Object.entries(pelicula).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === "poster" && !(value instanceof File)) {
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

export const getPeliculas = async () => {
  const response = await axios.get(`${API}/peliculas/`);
  return response.data;
};

export const getPeliculaById = async (id) => {
  const response = await axios.get(`${API}/peliculas/${id}/`);
  return response.data;
};

export const createPelicula = async (pelicula) => {
  const formData = buildFormData(pelicula);

  const response = await axios.post(`${API}/peliculas/`, formData, {
    headers: getHeaders(),
  });

  return response.data;
};

export const updatePelicula = async (id, pelicula) => {
  const formData = buildFormData(pelicula);

  const response = await axios.put(`${API}/peliculas/${id}/`, formData, {
    headers: getHeaders(),
  });

  return response.data;
};

export const deletePelicula = async (id) => {
  const response = await axios.delete(`${API}/peliculas/${id}/`, {
    headers: getHeaders(),
  });

  return response.data;
};