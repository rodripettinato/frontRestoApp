import React, { useEffect, useState } from "react";
import RestauranteCard from "../components/RestaurantesCard";
import restauranteService from "../services/restauranteService";
import { Box, Grid2, Typography, CircularProgress, Container } from "@mui/material";
import Navbar from "../components/Navbar";

export default function Restaurantes() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    restauranteService
      .obtenerRestaurantes()
      .then((response) => {
        if (!Array.isArray(response)) {
          throw new Error("Respuesta de API inválida");
        }
        setRestaurantes(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los restaurantes:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><Typography variant="h6" color="error">{`Error: ${error}`}</Typography></Box>;

  return (
    <>
      <Navbar />
      <Container sx={{ paddingTop: 6, paddingBottom: 6 }}>
        <Box sx={{ textAlign: "center", marginBottom: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold", fontSize: '2.5rem' }}>
            Restaurantes que trabajan con nosotros
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: '1rem' }}>
            Descubre los mejores restaurantes disponibles y disfruta de una experiencia única.
          </Typography>
        </Box>
        
        <Grid2 container spacing={4} justifyContent="center">
          {restaurantes.map((restaurante) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={restaurante.id}>
              <RestauranteCard
                nombre={restaurante.nombre}
                direccion={restaurante.direccion}
                imagen={restaurante.imagen ? `${process.env.REACT_APP_BACKEND_URL}${restaurante.imagen}` : "/img/restaurantes/default.jpg"}
              />
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </>
  );
};