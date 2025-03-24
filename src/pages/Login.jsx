import { Button, Box, Typography, Container } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/mis-restaurantes");
    }
  }, [navigate]);

  function navigateToRegister() {
    navigate("/register");
  }

  return (
    <>
    <Navbar />
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>
        <LoginForm />
        <Button onClick={navigateToRegister} sx={{ mt: 2 }}>
          ¿No tienes cuenta? Regístrate
        </Button>
      </Box>
    </Container>
    </>
  );
}