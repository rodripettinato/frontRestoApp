import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/restaurantes`;

const obtenerRestaurante = async (idRestaurante) => {
  try {
    const response = await axios.get(`${API_URL}/${idRestaurante}`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar restaurante:", error);
    throw error;
  }
};

const obtenerRestaurantesByOwner = async (idOwner) => {
  try {
    const response = await axios.get(`${API_URL}/owner/${idOwner}`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar restaurante:", error);
    throw error;
  }
};

const obtenerRestaurantes = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar restaurante:", error);
    throw error;
  }
};

const crearRestaurante = async (restaurante) => {
  try {
    const response = await axios.post(API_URL, restaurante);
    return response.data;
  } catch (error) {
    console.error("Error al crear restaurante:", error);
    throw error;
  }
};

const editarRestaurante = async (restaurante) => {
  try {
    await axios.put(`${API_URL}/${restaurante.id}`, restaurante);
  } catch (error) {
    console.error("Error al editar restaurante:", error);
    throw error;
  }
};

const eliminarRestaurante = async (idRestaurante) => {
  try {
    await axios.delete(`${API_URL}/${idRestaurante}`);
  } catch (error) {
    console.error("Error al eliminar restaurante:", error);
    throw error;
  }
};


const subirImagen = async (file) => {
  try {
    const formData = new FormData();
    formData.append("foto", file);
    const response = await axios.post(`${API_URL}/upload`, formData);
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
};

const productoService = {
  obtenerRestaurante,
  obtenerRestaurantesByOwner,
  obtenerRestaurantes,
  crearRestaurante,
  editarRestaurante,
  eliminarRestaurante,
  subirImagen,
};

export default productoService;
