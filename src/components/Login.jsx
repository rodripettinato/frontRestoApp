import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usuario: "", contraseña: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario_id", response.data.usuario_id);
      localStorage.setItem("userName", response.data.userName);
      navigate("/mis-restaurantes"); 
    } catch (error) {
      alert(error.response?.data?.message || "Error en el login");
    }
  }

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Usuario" name="usuario" onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Contraseña" type="password" name="contraseña" onChange={handleChange} margin="normal" required />
          <Box mt={2}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Iniciar Sesión
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}