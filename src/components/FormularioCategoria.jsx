import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

export default function FormularioCategoria({ categoriaInicial, onGuardar, idRestaurante }) {
  const [categoria, setCategoria] = useState({
    id: "",
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (categoriaInicial) {
      setCategoria({
        ...categoriaInicial,
        id: categoriaInicial.id || "",
      });
    }
  }, [categoriaInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria({ ...categoria, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const categoriaFinal = {
      ...categoria,
      id_restaurante: Number(idRestaurante),
    };
  
    onGuardar(categoriaFinal);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          {categoria.id ? "Editar Categoría" : "Crear Categoría"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre de la Categoría"
            name="nombre"
            value={categoria.nombre}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={categoria.descripcion}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={categoria.nombre === ""}
          >
            Guardar
          </Button>
        </form>
      </Box>
    </Container>
  );
}