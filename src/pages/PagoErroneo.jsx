import { Box, Button, Typography, Container, Avatar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import PaymentIcon from '@mui/icons-material/Payment';

export default function PagoStatus() {
  const navigate = useNavigate();
  const { estadoPago } = useParams();


  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            margin: "0 auto",
            bgcolor: estadoPago === "pendiente" ? "warning.main" : "error.main",
          }}
        >
          <PaymentIcon sx={{ fontSize: 60 }} />
        </Avatar>
        <Typography variant="h3" color={estadoPago === "pendiente" ? "warning" : "error"} gutterBottom>
          {estadoPago === "pendiente" ? "Pago Pendiente" : "Pago Fallido"}
        </Typography>
        <Typography variant="h5" paragraph>
          {estadoPago === "pendiente"
            ? "Tu pago está pendiente. Por favor, espera mientras procesamos tu pago."
            : "Hubo un problema con tu pago. Intenta nuevamente o contacta con soporte."}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Volver al Menú
        </Button>
      </Box>
    </Container>
  );
}