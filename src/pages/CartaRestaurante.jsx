import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Card, CardContent, CardMedia, Grid2, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Snackbar, Alert } from "@mui/material";
import productoService from "../services/productoService";
import categoryService from "../services/categoryService";
import mesaService from "../services/mesaService";
import restauranteService from "../services/restauranteService";
import NavbarCliente from "../components/NavBarCliente";

export default function CartaRestaurante() {
  const { restauranteId, mesaNumero } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [prevRestaurante, setPrevRestaurante] = useState(null);
  const [prevMesa, setPrevMesa] = useState(null);
  const [nombreRestaurante, setNombreRestaurante] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const obtenerNombreRestaurante = useCallback(async () => {
    try {
      const restaurante = await restauranteService.obtenerRestaurante(restauranteId);
      if (restaurante) {
        setNombreRestaurante(restaurante.nombre);
        localStorage.setItem("restauranteNombre", restaurante.nombre);
      }
    } catch (error) {
      console.error("Error al obtener el nombre del restaurante:", error);
    }
  }, [restauranteId]);

  const cargarCategorias = useCallback(async () => {
    try {
      const data = await categoryService.obtenerCategorias(restauranteId);
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  }, [restauranteId]);

  const cargarProductos = useCallback(async () => {
    try {
      const data = await productoService.obtenerProductosPorRestauranteDisponibles(restauranteId);
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }, [restauranteId]);

  const cargarMesa = async (restauranteId, mesaNumero) => {
    try {
      const mesa = await mesaService.obtenerMesaPorNumero(restauranteId, mesaNumero);
      if (mesa) {
        localStorage.setItem("mesaId", mesa.id);
      }
    } catch (error) {
      console.error("Error al cargar la mesa:", error);
    }
  };

  const inicializarDatos = useCallback(() => {
    if (restauranteId && mesaNumero) {
      localStorage.setItem("restauranteId", restauranteId);
      localStorage.setItem("mesaNumero", mesaNumero);
      cargarMesa(restauranteId, mesaNumero);
    }
    obtenerNombreRestaurante();
    cargarCategorias();
    cargarProductos();
  }, [restauranteId, mesaNumero, cargarCategorias, cargarProductos, obtenerNombreRestaurante]);

  useEffect(() => {
    const restauranteGuardado = localStorage.getItem("restauranteId");
    const mesaGuardada = localStorage.getItem("mesaNumero");

    if (restauranteGuardado && mesaGuardada) {
      if (restauranteGuardado !== restauranteId || mesaGuardada !== mesaNumero) {
        setPrevRestaurante(restauranteGuardado);
        setPrevMesa(mesaGuardada);
        setOpenDialog(true);
        return;
      }
      else {
        inicializarDatos();
      }
    }
  }, [restauranteId, mesaNumero, inicializarDatos]);

  const handleConfirmChange = () => {
    localStorage.removeItem("carrito");
    setOpenDialog(false);
    inicializarDatos();
  };

  const handleCancelChange = () => {
    setOpenDialog(false);
    navigate(-1);
  };

  const agregarAlCarrito = (producto) => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ ...producto, cantidad: 1 });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    setSnackbarMessage(`¡${producto.nombre} agregado al carrito!`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, pb: 10 }}>
       <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          📜 Carta de {nombreRestaurante || "Restaurante"}
        </Typography>
       <Typography variant="h6" color="text.secondary">
        Mesa <b>{mesaNumero}</b>
        </Typography>
      </Box>

        {categorias.map((categoria) => {
          const productosFiltrados = productos.filter((p) => p.categoria_id === categoria.id);
          if (productosFiltrados.length === 0) return null;

          return (
            <Box key={categoria.id} mb={4}>
              <Typography variant="h4" fontWeight="bold" color="secondary" sx={{ borderBottom: "3px solid #ff9800", pb: 1, mb: 3 }}>
                {categoria.nombre}
              </Typography>

              <Grid2 container spacing={3}>
                {productosFiltrados.map((producto) => (
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={producto.id}>
                    <Card sx={{
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.03)" }
                    }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={producto.foto ? `${process.env.REACT_APP_BACKEND_URL}${producto.foto}` : "/img/restaurantes/default.jpg"}
                        alt={producto.nombre}
                        sx={{ borderRadius: "10px 10px 0 0" }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {producto.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {producto.descripcion}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                          ${new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 }).format(producto.precio)}
                        </Typography>
                      </CardContent>
                      <Box sx={{ textAlign: "center", pb: 2 }}>
                        <Button 
                          variant="contained" 
                          color="secondary"
                          sx={{ width: "90%", fontWeight: "bold" }}
                          onClick={() => agregarAlCarrito(producto)}
                        >
                          ➕ Agregar al carrito
                        </Button>
                      </Box>
                    </Card>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          );
        })}
      </Container>

      <NavbarCliente />

      <Dialog open={openDialog} onClose={handleCancelChange}>
        <DialogTitle>⚠ Cambio de Restaurante o Mesa</DialogTitle>
        <DialogContent>
          <Typography>
            Ya tienes un pedido en el Restaurante <b>{prevRestaurante}</b>, Mesa <b>{prevMesa}</b>.
          </Typography>
          <Typography>
            Si continúas, <b>se borrará tu carrito</b> y se actualizará con el nuevo restaurante y mesa.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelChange} color="error">
            Cancelar
          </Button>
          <Button onClick={handleConfirmChange} color="primary">
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
        sx={{ mb: 8 }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}