import { Box, Button, Typography, Container, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ForkLeft } from '@mui/icons-material';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Avatar sx={{ width: 120, height: 120, margin: '0 auto', bgcolor: 'error.main' }}>
          <ForkLeft sx={{ fontSize: 60 }} />
        </Avatar>
        <Typography variant="h3" color="error" gutterBottom>
          404 - ¡No encontramos esa receta!
        </Typography>
        <Typography variant="h5" paragraph>
          Parece que la página que buscas se ha ido a la parrilla. No te preocupes, ¡podemos cocinar algo delicioso para vos!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Volver al menú
        </Button>
      </Box>
    </Container>
  );
}
