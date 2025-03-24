import { useEffect, useState } from "react";
import io from "socket.io-client";
import ventaService from "../services/ventaService";
import { Typography, Container, Card, CardContent, CardMedia, Button, Snackbar, List, ListItem, ListItemText, Grid2, Box } from "@mui/material";
import { useParams } from 'react-router-dom';

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

export default function Pedido() {
  const [venta, setVenta] = useState(null);
  const { merchantOrderId } = useParams();
  const [comprador, setComprador] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
  });
  const [detalle, setDetalle] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    ventaService.obtenerDetalleVenta(merchantOrderId)
      .then((data) => {
        setVenta(data);
        setDetalle(data.detalleVentas);
        setComprador({
          nombre: data.comprador_nombre,
          apellido: data.comprador_apellido,
          telefono: data.comprador_telefono,
          dni: data.dni_comprador,
        });
      })
      .catch((err) => console.error(err));

    socket.on("actualizar_pedido", (data) => {
      if (data.id === merchantOrderId) {
        setVenta((prevVenta) => ({
          ...prevVenta,
          estado: data.estado,
        }));
      }
    });

    return () => socket.off("actualizar_pedido");
  }, [merchantOrderId]);

  const llamarMozo = () => {
    socket.emit("llamar_mozo", { idMesa: venta.mesa.numero_mesa, idRestaurante: venta.id_restaurante });
    setOpenSnackbar(true);

    setTimeout(() => {
      setOpenSnackbar(false);
    }, 3000);
  };

  if (!venta) {
    return <Typography variant="h6">Cargando el estado de tu pedido...</Typography>;
  }

  return (
    <Container sx={{ paddingTop: 6, paddingBottom: 6 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Estado del Pedido #{venta.merchantOrderId}
      </Typography>

      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
                  Pedido #{venta.merchantOrderId}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
                  <strong>Número de Mesa:</strong> {venta.mesa.numero_mesa}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Cliente:</strong> {comprador.nombre} {comprador.apellido}
                </Typography>
                <Typography variant="body1">
                  <strong>DNI:</strong> {comprador.dni}
                </Typography>
                <Typography variant="body1">
                  <strong>Teléfono:</strong> {comprador.telefono}
                </Typography>

                <Typography variant="body1" sx={{ mt: 2 }}><strong>Monto:</strong> ${new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 }).format(venta.monto)}</Typography>
                <Typography variant="body1"><strong>Método de pago:</strong> {venta.metodo_de_pago}</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}><strong>Estado:</strong> {venta.estado}</Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={llamarMozo}
                  sx={{ mt: 3, textTransform: 'none', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                >
                  Llamar al Mozo
                </Button>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>Detalle del Pedido</Typography>
              <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                {detalle.map((item) => (
                  <ListItem key={item.id} sx={{ padding: '8px 0' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 2, mr: 2 }}
                      image={item.producto.foto ? `${process.env.REACT_APP_BACKEND_URL}${item.producto.foto}` : "/img/restaurantes/default.jpg"}
                      alt={item.producto.nombre}
                    />
                    <ListItemText
                      primary={item.producto.nombre}
                      secondary={`Cantidad: ${item.cantidad} - Precio Unitario: $${new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 }).format(item.precio_unitario)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid2>
          </Grid2>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message="Mozo solicitado"
          />
        </CardContent>
      </Card>
    </Container>
  );
};