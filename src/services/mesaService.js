import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/mesa`;


const obtenerMesas = async (restauranteID) => {
    try {
      const response = await axios.get(`${API_URL}/restaurante/${restauranteID}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la mesa", error);
      throw error;
    }
  };

const obtenerMesaPorNumero = async (restauranteID, numeroMesa) => {
    try {
      const response = await axios.get(`${API_URL}/numero/${restauranteID}/${numeroMesa}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la mesa", error);
      throw error;
    }
  };

const crearMesa = async (mesa) => {
  try {
    const response = await axios.post(`${API_URL}`, mesa);
    return response.data;
  } catch (error) {
    console.error("Error al crear la mesa", error);
    throw error;
  }
};

const actualizarMesa = async (id, mesa) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, mesa);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la mesa", error);
    throw error;
  }
};

const eliminarMesa = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error al eliminar la mesa", error);
    throw error;
  }
};

const mesaService = {
    obtenerMesas,
    obtenerMesaPorNumero,
    crearMesa,
    actualizarMesa,
    eliminarMesa,
  };

export default mesaService;
