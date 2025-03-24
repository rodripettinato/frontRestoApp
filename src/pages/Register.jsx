import { Button, Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/Register";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/mis-restaurantes");
    }
  }, [navigate]);

  function navigateToLogin() {
    navigate("/login");
  }

  return (
    <>
    <Navbar />
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Registrarse
        </Typography>
        <RegisterForm />
        <Button onClick={navigateToLogin} sx={{ mt: 2 }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Box>
    </Container>
    </>
  );
}
