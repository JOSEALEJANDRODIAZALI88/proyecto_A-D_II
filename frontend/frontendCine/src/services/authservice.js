import axios from "axios";

const API = "http://localhost:8000/api";

export const login = async (correo, password) => {

//CAMBIAR LUEGO POR LA API DE LA NUEVA BASE DE DATOS
  if (correo === "admin@test.com") {
    return {
      token: "123456",
      rol: "admin",
    };
  }

  return {
    token: "123456",
    rol: "usuario",
  };
};