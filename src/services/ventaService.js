import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/ventas`;

const obtenerDetalleVenta = async (ventaId) => {
  try {
    const response = await axios.get(`${API_URL}/detalle_venta/${ventaId}`);
    return response.data;
  } catch (err) {
    console.error("Error al obtener los detalles de la venta", err);
    throw err;
  }
};

const obtenerEstadisticasVentas = async (idRestaurante) => {
    try {
      const response = await axios.get(`${API_URL}/${idRestaurante}`);
      return response.data;
    } catch (err) {
      console.error("Error al obtener estadísticas de ventas", err);
      throw err;
    }
  };
  
  const obtenerHistorialPrecio = async (productoId) => {
    try {
      const response = await axios.get(`${API_URL}/historial_precio/${productoId}`);
      return response.data;
    } catch (err) {
      console.error("Error al obtener historial de precios", err);
      throw err;
    }
  };

  const obtenerVentasEnTiempoReal = async (idRestaurante) => {
    try {
      const response = await axios.get(`${API_URL}/realtime/${idRestaurante}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      throw error;
    }
  };
  
  const cambiarEstadoVenta = async (id, nuevoEstado) => {
    try {
      await axios.patch(`${API_URL}/cambiar_estado/${id}`, { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al cambiar el estado de la venta:", error);
      throw error;
    }
  };

const ventaService = {
    obtenerDetalleVenta,
    obtenerEstadisticasVentas,
    obtenerHistorialPrecio,
    obtenerVentasEnTiempoReal,
    cambiarEstadoVenta,
  };

export default ventaService;