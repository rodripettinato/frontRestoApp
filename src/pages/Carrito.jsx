import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Button, Card, CardMedia, CardContent, 
  IconButton, Grid2, CircularProgress, TextField, Box, Paper 
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import axios from "axios";
import NavbarCliente from "../components/NavBarCliente";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);
  
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const restauranteID = localStorage.getItem("restauranteId");
  const mesaID = localStorage.getItem("mesaId");
  const nombreRestaurante = localStorage.getItem("restauranteNombre") || "Restaurante";

  useEffect(() => {
    const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoLocal);
    setCargando(false);
  }, []);

  const modificarCantidad = (id, cantidad) => {
    const nuevoCarrito = carrito.map((producto) =>
      producto.id === id ? { ...producto, cantidad: Math.max(1, producto.cantidad + cantidad) } : producto
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const realizarPago = async () => {
    if (!nombre || !apellido || !dni || !telefono) {
      setErrorPago("Por favor, completa todos los campos antes de pagar.");
      return;
    }

    setProcesandoPago(true);
    setErrorPago(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pagos/crear-preferencia`, { 
        carrito,
        nombre,
        apellido,
        dni,
        telefono, 
        restauranteID,
        mesaID
      });
      localStorage.removeItem("carrito");
      window.location.href = response.data.redirectUrl;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setErrorPago("Hubo un problema al procesar el pago. Intenta nuevamente.");
    } finally {
      setProcesandoPago(false);
    }
  };

  return (
    <>
    <Container maxWidth="md" sx={{ mt: 4, pb: 10 }}>
    <Typography variant="h4" gutterBottom 
    sx={{
    fontWeight: "bold", 
    color: "primary.main", 
    backgroundColor: "#f5f5f5", 
    padding: "10px 20px", 
    borderRadius: 2, 
    boxShadow: 2, 
    textAlign: "center", 
    marginBottom: 4, 
    }}
    >
  Carrito de Compras {nombreRestaurante}
</Typography>

      {cargando ? (
        <Typography variant="h6">Cargando productos...</Typography>
      ) : (
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            {carrito.length > 0 ? (
              carrito.map((producto) => (
                <Card key={producto.id} sx={{ display: "flex", alignItems: "center", mb: 2, p: 2, borderRadius: 3, boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 2 }}
                    image={producto.foto ? `${process.env.REACT_APP_BACKEND_URL}${producto.foto}` : "/img/restaurantes/default.jpg"}
                    alt={producto.nombre}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{producto.nombre}</Typography>
                    <Typography variant="body1">Precio: ${new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 }).format(producto.precio)}</Typography>
                    <Typography variant="body1">Cantidad: {producto.cantidad}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <IconButton onClick={() => modificarCantidad(producto.id, -1)} color="primary">
                        <Remove />
                      </IconButton>
                      <Typography variant="body1" sx={{ mx: 2 }}>{producto.cantidad}</Typography>
                      <IconButton onClick={() => modificarCantidad(producto.id, 1)} color="primary">
                        <Add />
                      </IconButton>
                      <IconButton onClick={() => eliminarProducto(producto.id)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="h6">Tu carrito está vacío.</Typography>
            )}
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" textAlign="center">Total: ${new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 }).format(total)}</Typography>
              <Box sx={{ mt: 2 }}>
                <TextField label="Nombre" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} sx={{ mb: 2 }} />
                <TextField label="Apellido" fullWidth value={apellido} onChange={(e) => setApellido(e.target.value)} sx={{ mb: 2 }} />
                <TextField label="DNI" fullWidth value={dni} onChange={(e) => setDni(e.target.value)} type="number" sx={{ mb: 2 }} />
                <TextField label="Teléfono" fullWidth value={telefono} onChange={(e) => setTelefono(e.target.value)} type="number" sx={{ mb: 2 }} />
              </Box>
              {carrito.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={realizarPago}
                  disabled={procesandoPago}
                >
                  {procesandoPago ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Pagar con MercadoPago"}
                </Button>
              )}
              {errorPago && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>{errorPago}</Typography>
              )}
            </Paper>
          </Grid2>
        </Grid2>
      )}
    </Container>
    <NavbarCliente />
    </>
  );
}