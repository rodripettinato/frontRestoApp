import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Container, Card, CardContent, CardMedia, Typography, Grid2, CircularProgress } from "@mui/material";
import { useParams } from 'react-router-dom'; 
import Navbar from "../components/Navbar";
import ventaService from "../services/ventaService"; 
import BackButton from "../components/BackButton";

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Estadisticas() {
  const { idRestaurante } = useParams();

  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [productoMasVendido, setProductoMasVendido] = useState(null);
  const [productoMenosVendido, setProductoMenosVendido] = useState(null);
  const [historialPreciosMasVendido, setHistorilaMasVendidoPrecios] = useState([]);
  const [historialPreciosMenosVendido, setHistorialMenosVendidoPrecios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ventaService.obtenerEstadisticasVentas(idRestaurante)
      .then((response) => {
        setVentasPorMes(response.ventasPorMes);
        setProductoMasVendido(response.productoMasVendido);
        setProductoMenosVendido(response.productoMenosVendido);

        if (response.productoMasVendido) {
          ventaService.obtenerHistorialPrecio(response.productoMasVendido.id)
            .then(res => {
              setHistorilaMasVendidoPrecios(res);
            })
            .catch(err => console.error("Error al obtener historial de precios:", err));
        }

        if (response.productoMenosVendido) {
          ventaService.obtenerHistorialPrecio(response.productoMenosVendido.id)
            .then(res => {
              setHistorialMenosVendidoPrecios(res);
            })
            .catch(err => console.error("Error al obtener historial de precios:", err));
        }
      })
      .catch(error => console.error("Error al obtener estadísticas:", error))
      .finally(() => setLoading(false));
  }, [idRestaurante]);

  if (loading) {
    return <CircularProgress style={{ display: "block", margin: "50px auto" }} />;
  }

  const ventasData = {
    labels: ventasPorMes.map(v => new Date(v.fecha).toLocaleDateString()),
    datasets: [{
      label: "Monto Vendido ($)",
      data: ventasPorMes.map(v => v.monto),
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    }]
  };

  const preciosMasVendidoData = {
    labels: historialPreciosMasVendido.map(p => new Date(p.fecha).toLocaleDateString()),
    datasets: [{
      label: "Precio ($)",
      data: historialPreciosMasVendido.map(p => p.precio_unitario),
      borderColor: "rgba(255, 99, 132, 1)",
      fill: false,
    }]
  };

  const preciosMenosVendidoData = {
    labels: historialPreciosMenosVendido.map(p => new Date(p.fecha).toLocaleDateString()),
    datasets: [{
      label: "Precio ($)",
      data: historialPreciosMenosVendido.map(p => p.precio_unitario),
      borderColor: "rgba(255, 99, 132, 1)",
      fill: false,
    }]
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <BackButton />
        <Typography variant="h4" align="center" gutterBottom>
          📊 Estadísticas de Ventas
        </Typography>

        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  💰 Ventas por Mes
                </Typography>
                <Bar data={ventasData}/>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5">🥇 Producto Más Vendido</Typography>
                <CardMedia
                  component="img"
                  height="140"
                  image={productoMasVendido.foto ? `${process.env.REACT_APP_BACKEND_URL}${productoMasVendido.foto}` : "/img/restaurantes/default.jpg"}
                  alt={productoMasVendido.nombre}
                />
                <Typography variant="h6">{productoMasVendido ? productoMasVendido.nombre : "N/A"}</Typography>
              </CardContent>
              {historialPreciosMasVendido.length > 0 && (
                <CardContent>
                  <Typography variant="h5">📈 Historial de Precio</Typography>
                  <Line data={preciosMasVendidoData} />
                </CardContent>
              )}
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h5">🥇 Producto Menos Vendido</Typography>
                <CardMedia
                  component="img"
                  height="140"
                  image={productoMenosVendido.foto ? `${process.env.REACT_APP_BACKEND_URL}${productoMenosVendido.foto}` : "/img/restaurantes/default.jpg"}
                  alt={productoMenosVendido.nombre}
                />
                <Typography variant="h6">{productoMenosVendido ? productoMenosVendido.nombre : "N/A"}</Typography>
              </CardContent>
              {historialPreciosMenosVendido.length > 0 && (
                <CardContent>
                  <Typography variant="h5">📈 Historial de Precio</Typography>
                  <Line data={preciosMenosVendidoData} />
                </CardContent>
              )}
            </Card>
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
}