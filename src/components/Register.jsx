import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: "",
    nombre: "",
    dni: "",
    fecha_de_nacimiento: "",
    contraseña: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      alert("Registro exitoso, ahora puedes iniciar sesión.");
      navigate("/login"); 
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrar");
    }
  }

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Registrarse
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Usuario" name="usuario" onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Nombre" name="nombre" onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="DNI" type="number" name="dni" onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Fecha de Nacimiento" type="date" name="fecha_de_nacimiento" onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Contraseña" type="password" name="contraseña" onChange={handleChange} margin="normal" required />
          <Box mt={2}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Registrarse
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
