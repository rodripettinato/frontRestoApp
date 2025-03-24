import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/product`;

const obtenerProductosPorRestaurante = async (idRestaurante) => {
  try {
    const response = await axios.get(`${API_URL}/restaurante/${idRestaurante}`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    throw error;
  }
};

const obtenerProductosPorRestauranteDisponibles = async (idRestaurante) => {
  try {
    const response = await axios.get(`${API_URL}/restaurante/${idRestaurante}/disponibles`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    throw error;
  }
};

const crearProducto = async (producto) => {
  try {
    const response = await axios.post(API_URL, producto);
    return response.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

const editarProducto = async (producto) => {
  try {
    await axios.put(`${API_URL}/${producto.id}`, producto);
  } catch (error) {
    console.error("Error al editar producto:", error);
    throw error;
  }
};

const eliminarProducto = async (idProducto) => {
  try {
    await axios.delete(`${API_URL}/${idProducto}`);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
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
  obtenerProductosPorRestaurante,
  obtenerProductosPorRestauranteDisponibles,
  crearProducto,
  editarProducto,
  eliminarProducto,
  subirImagen,
};

export default productoService;
