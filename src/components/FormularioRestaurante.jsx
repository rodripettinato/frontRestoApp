import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import restauranteService from "../services/restauranteService";

export default function FormularioRestaurante({ restauranteInicial, onGuardar }) {

  const usuario_id = localStorage.getItem("usuario_id");

  const [restaurante, setRestaurante] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    direccion: "",
    foto: "",
    usuario_id: usuario_id,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (restauranteInicial) {
      setRestaurante({
        ...restauranteInicial,
      });
      setPreview(restauranteInicial.foto ? `${process.env.REACT_APP_BACKEND_URL}${restauranteInicial.foto}` : "/img/restaurantes/default.jpg");
    }
  }, [restauranteInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurante({ ...restaurante, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const restauranteFinal = {
        ...restaurante,
        id: Number(restaurante.id),
        usuario_id: Number(restaurante.usuario_id),
      };

      if (restauranteFinal.foto instanceof File) {
        const imageUrl = await restauranteService.subirImagen(restauranteFinal.foto);
        onGuardar({ ...restauranteFinal, foto: imageUrl });
      } else {
        onGuardar(restauranteFinal);
      }
    } catch (error) {
      console.error("Error al procesar el restaurante:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRestaurante({ ...restaurante, foto: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          {restaurante.id ? "Editar Restaurante" : "Crear Restaurante"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre del Restaurante"
            name="nombre"
            value={restaurante.nombre}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={restaurante.descripcion}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Dirección"
            name="direccion"
            value={restaurante.direccion}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Button variant="contained" component="label">
              Subir Foto
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {preview && <img src={preview} alt="Vista previa" style={{ width: "150px", borderRadius: "8px" }} />}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={restaurante.nombre === "" || restaurante.direccion === "" || restaurante.usuario_id === ""}
          >
            Guardar
          </Button>
        </form>
      </Box>
    </Container>
  );
}