import React from 'react';
import { Container, Grid2, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const { idRestaurante } = useParams();

  return (
    <>
    <Navbar />
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Dashboard del Administrador
      </Typography>

      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Categorías</Typography>
              <Typography variant="body2" color="textSecondary">Gestiona las categorías de productos.</Typography>
              <Box mt={2}>
                <Button component={Link} to={`/dashboard/${idRestaurante}/categorias`} fullWidth variant="contained" color="primary">
                  Ir a Categorías
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Productos</Typography>
              <Typography variant="body2" color="textSecondary">Gestiona los productos del restaurante.</Typography>
              <Box mt={2}>
                <Button component={Link} to={`/dashboard/${idRestaurante}/productos`} fullWidth variant="contained" color="primary">
                  Ir a Productos
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Estadisticas</Typography>
              <Typography variant="body2" color="textSecondary">Analiza las estadisticas de las ventas.</Typography>
              <Box mt={2}>
                <Button component={Link} to={`/dashboard/${idRestaurante}/estadisticas`} fullWidth variant="contained" color="primary">
                  Ir a Estadisticas
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Mesas</Typography>
              <Typography variant="body2" color="textSecondary">Gestiona las mesas del restaurante.</Typography>
              <Box mt={2}>
                <Button component={Link} to={`/dashboard/${idRestaurante}/mesas`} fullWidth variant="contained" color="primary">
                  Ir a Mesas
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Ventas en tiempo real</Typography>
              <Typography variant="body2" color="textSecondary">Gestiona las ventas en tiempo real.</Typography>
              <Box mt={2}>
                <Button component={Link} to={`/dashboard/${idRestaurante}/ventas`} fullWidth variant="contained" color="primary">
                  Ir a Ventas en tiempo real
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
    </>
  );
}