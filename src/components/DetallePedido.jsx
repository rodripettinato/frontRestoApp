import { useState, useEffect } from "react";
import ventaService from "../services/ventaService";
import { Modal, Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

export default function DetallePedido({ ventaId, onClose }){
  const [detalle, setDetalle] = useState([]);
  const [numeroMesa, setNumeroMesa] = useState(null);
  const [comprador, setComprador] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
  });

  useEffect(() => {
    ventaService.obtenerDetalleVenta(ventaId)
      .then((data) => {
        setNumeroMesa(data.mesa.numero_mesa);
        setDetalle(data.detalleVentas);
        setComprador({
          nombre: data.comprador_nombre,
          apellido: data.comprador_apellido,
          telefono: data.comprador_telefono,
          dni: data.dni_comprador,
        });
      })
      .catch((err) => console.error(err));
  }, [ventaId]);

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Detalle del Pedido #{ventaId}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Cliente:</strong> {comprador.nombre} {comprador.apellido}
        </Typography>
        <Typography variant="body1">
          <strong>DNI:</strong> {comprador.dni}
        </Typography>
        <Typography variant="body1">
          <strong>Teléfono:</strong> {comprador.telefono}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Número de Mesa:</strong> {numeroMesa}
        </Typography>

        <List sx={{ mt: 2 }}>
          {detalle.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.producto.nombre}
                secondary={`Cantidad: ${item.cantidad} - Precio Unitario: $${new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 }).format(item.precio_unitario)}`}
              />
            </ListItem>
          ))}
        </List>

        <Button onClick={onClose} color="secondary" sx={{ mt: 2 }}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};