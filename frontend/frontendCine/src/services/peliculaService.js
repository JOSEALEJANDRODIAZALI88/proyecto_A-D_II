import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const getPeliculas = async () => {
  const response = await axios.get(`${API_URL}/peliculas/`);
  return response.data;
};

export const getPeliculaById = async (id) => {
  const response = await axios.get(`${API_URL}/peliculas/${id}/`);
  return response.data;
};

export const createPelicula = async (pelicula) => {
  const formData = new FormData();

  formData.append("titulo", pelicula.titulo);
  formData.append("genero", pelicula.genero);
  formData.append("sinopsis", pelicula.sinopsis);
  formData.append("descripcion", pelicula.sinopsis);
  formData.append("duracion", pelicula.duracion);
  formData.append("clasificacion", pelicula.clasificacion);
  formData.append("idioma", pelicula.idioma);
  formData.append("formato", pelicula.formato);
  formData.append("fecha_estreno", pelicula.fecha_estreno);
  formData.append("estado", pelicula.estado);

  if (pelicula.poster) {
    formData.append("poster", pelicula.poster);
  }

  const response = await axios.post(`${API_URL}/peliculas/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updatePelicula = async (id, pelicula) => {
  const formData = new FormData();

  formData.append("titulo", pelicula.titulo);
  formData.append("genero", pelicula.genero);
  formData.append("sinopsis", pelicula.sinopsis);
  formData.append("descripcion", pelicula.sinopsis);
  formData.append("duracion", pelicula.duracion);
  formData.append("clasificacion", pelicula.clasificacion);
  formData.append("idioma", pelicula.idioma);
  formData.append("formato", pelicula.formato);
  formData.append("fecha_estreno", pelicula.fecha_estreno);
  formData.append("estado", pelicula.estado);

  if (pelicula.poster) {
    formData.append("poster", pelicula.poster);
  }

  const response = await axios.put(`${API_URL}/peliculas/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deletePelicula = async (id) => {
  const response = await axios.delete(`${API_URL}/peliculas/${id}/`);
  return response.data;
};