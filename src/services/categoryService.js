import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/category`;

const obtenerCategorias = async (idRestaurante) => {
  try {
    const response = await axios.get(`${API_URL}/restaurante/${idRestaurante}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
};

const crearCategoria = async (categoria) => {
  try {
    const response = await axios.post(API_URL, categoria);
    return response.data;
  } catch (error) {
    console.error("Error al crear categoría:", error);
    throw error;
  }
};

const actualizarCategoria = async (id, categoria) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, categoria);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    throw error;
  }
};

const eliminarCategoria = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    throw error;
  }
};

const categoriaService = {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};

export default categoriaService;
