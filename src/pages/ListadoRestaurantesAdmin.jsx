import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import restauranteService from "../services/restauranteService";
import FormularioRestaurante from "../components/FormularioRestaurante";
import Navbar from "../components/Navbar";

export default function ListadoRestaurantesAdmin() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [restauranteAEliminar, setRestauranteAEliminar] = useState(null);
  const navigate = useNavigate();

  const usuario_id = localStorage.getItem("usuario_id");

  useEffect(() => {
    async function cargarRestaurantes() {
      try {
        const restaurantesData = await restauranteService.obtenerRestaurantesByOwner(usuario_id);
        setRestaurantes(restaurantesData);
      } catch (error) {
        console.error(error);
      }
    }
    cargarRestaurantes();
  }, [usuario_id]);

  const handleOpenForm = (restaurante = null) => {
    setRestauranteSeleccionado(restaurante);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setRestauranteSeleccionado(null);
  };

  const handleGuardarRestaurante = async (restaurante) => {
    try {
      if (restaurante.id) {
        await restauranteService.editarRestaurante(restaurante);
        setRestaurantes(prev => prev.map(r => (r.id === restaurante.id ? restaurante : r)));
      } else {
        const restauranteFinal = { ...restaurante, id: undefined };
        const nuevoRestaurante = await restauranteService.crearRestaurante(restauranteFinal);
        setRestaurantes(prev => [...prev, nuevoRestaurante]);
      }
      handleCloseForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenConfirm = (restaurante) => {
    setRestauranteAEliminar(restaurante);
    setOpenConfirm(true);
  };

  const handleEliminarRestaurante = async () => {
    try {
      await restauranteService.eliminarRestaurante(restauranteAEliminar.id);
      setRestaurantes(prev => prev.filter(r => r.id !== restauranteAEliminar.id));
      setOpenConfirm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>Restaurantes</Typography>

        <Button variant="contained" color="primary" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
          Crear Nuevo Restaurante
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Imagen</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Dirección</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurantes.map((restaurante) => (
                <TableRow 
                  key={restaurante.id} 
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/dashboard/${restaurante.id}`)}
                >
                  <TableCell>
                    <img 
                      src={restaurante.foto ? `${process.env.REACT_APP_BACKEND_URL}${restaurante.foto}` : "/img/restaurantes/default.jpg"}
                      alt={restaurante.nombre}
                      style={{ width: 50, height: 50, borderRadius: 5 }} 
                    />
                  </TableCell>
                  <TableCell>{restaurante.nombre}</TableCell>
                  <TableCell>{restaurante.direccion}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleOpenForm(restaurante)} 
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => handleOpenConfirm(restaurante)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {openForm && (
          <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
            <DialogTitle>{restauranteSeleccionado ? "Editar Restaurante" : "Crear Restaurante"}</DialogTitle>
            <DialogContent>
              <FormularioRestaurante restauranteInicial={restauranteSeleccionado} onGuardar={handleGuardarRestaurante} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm} color="secondary">Cancelar</Button>
            </DialogActions>
          </Dialog>
        )}

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>¿Seguro que quieres eliminar este restaurante?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="secondary">Cancelar</Button>
            <Button onClick={handleEliminarRestaurante} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}