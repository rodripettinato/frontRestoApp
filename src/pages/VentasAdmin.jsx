import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button, Typography, Container, Grid2, Card, CardContent, CardActions, Alert, Box, IconButton } from "@mui/material";
import DetallePedido from "../components/DetallePedido";
import { useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Navbar from "../components/Navbar";
import ventaService from "../services/ventaService";
import BackButton from "../components/BackButton";

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

export default function AdminDashboard() {
  const [ventas, setVentas] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);

  const { idRestaurante } = useParams();

  useEffect(() => {
    ventaService
      .obtenerVentasEnTiempoReal(idRestaurante)
      .then((data) => setVentas(data))
      .catch((err) => console.error(err));

    socket.on("actualizar_pedido", (data) => {
      setVentas((prevVentas) =>
        prevVentas.map((venta) =>
          venta.merchantOrderId === data.id ? { ...venta, estado: data.estado } : venta
        )
      );
    });

    socket.on(`mozo_solicitado/${idRestaurante}`, (data) => {
      setNotificaciones((prevNotificaciones) => [
        ...prevNotificaciones,
        { id: data.idMesa, mensaje: `El cliente de la mesa #${data.idMesa} ha llamado al mozo.` },
      ]);
    });

    return () => {
      socket.off("actualizar_pedido");
      socket.off(`mozo_solicitado/${idRestaurante}`);
    };
  }, [idRestaurante]);

  const cambiarEstado = (id, nuevoEstado) => {
    ventaService.cambiarEstadoVenta(id, nuevoEstado);
  };

  const verDetallePedido = (merchantOrderId) => {
    setPedidoSeleccionado(merchantOrderId);
  };

  const cerrarDetalle = () => {
    setPedidoSeleccionado(null);
  };

  const eliminarNotificacion = (id) => {
    setNotificaciones((prevNotificaciones) => prevNotificaciones.filter((noti) => noti.id !== id));
  };

  return (
    <>
      <Navbar />
      <Container>
        <BackButton />
        <Typography variant="h4" gutterBottom>
          Pedidos en Vivo
        </Typography>

        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Grid2 container spacing={2}>
              {ventas.map((venta) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={venta.merchantOrderId}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Pedido #{venta.merchantOrderId}</Typography>
                      <Typography variant="body1">Estado: {venta.estado}</Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => cambiarEstado(venta.merchantOrderId, "En preparación")}
                      >
                        En preparación
                      </Button>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => cambiarEstado(venta.merchantOrderId, "Finalizado")}
                      >
                        Finalizar Orden
                      </Button>
                      <Button size="small" onClick={() => verDetallePedido(venta.merchantOrderId)}>
                        Ver Detalles
                      </Button>
                    </CardActions>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" gutterBottom>
              Llamadas de Mesas
            </Typography>
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              {notificaciones.length > 0 ? (
                notificaciones.map((noti) => (
                  <Alert
                    key={noti.id}
                    severity="info"
                    sx={{ marginBottom: 1, display: "flex", alignItems: "center" }}
                    action={
                      <IconButton size="small" onClick={() => eliminarNotificacion(noti.id)}>
                        <CheckCircleIcon fontSize="inherit" style={{ color: "green" }} />
                      </IconButton>
                    }
                  >
                    {noti.mensaje}
                  </Alert>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No hay llamadas pendientes.
                </Typography>
              )}
            </Box>
          </Grid2>
        </Grid2>

        {pedidoSeleccionado && <DetallePedido ventaId={pedidoSeleccionado} onClose={cerrarDetalle} />}
      </Container>
    </>
  );
};

