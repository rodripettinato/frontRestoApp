import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from "@mui/material";
import categoryService from "../services/categoryService";
import FormularioCategoria from "../components/FormularioCategoria";
import BackButton from "../components/BackButton"; 
import { useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function ListadoCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [error, setError] = useState(null);

  const { idRestaurante } = useParams();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoryService.obtenerCategorias(idRestaurante);
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, [idRestaurante]);

  const handleOpenForm = (categoria = null) => {
    setCategoriaSeleccionada(categoria);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCategoriaSeleccionada(null);
  };

  const handleGuardarCategoria = async (categoria) => {
    try {
      if (categoria.id) {
        const updatedCategoria = await categoryService.actualizarCategoria(categoria.id, categoria);
        setCategorias((prev) => prev.map((c) => (c.id === categoria.id ? updatedCategoria : c)));
      } else {
        const categoriaFinal = {
          ...categoria,
          id: undefined,
        };
        const newCategoria = await categoryService.crearCategoria(categoriaFinal);
        setCategorias((prev) => [...prev, newCategoria]);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
    }
  };

  const handleOpenConfirm = (categoria) => {
    setCategoriaAEliminar(categoria);
    setOpenConfirm(true);
  };

  const handleEliminarCategoria = async () => {
    try {
      await categoryService.eliminarCategoria(categoriaAEliminar.id);
      setCategorias((prev) => prev.filter((c) => c.id !== categoriaAEliminar.id));
      setOpenConfirm(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Error al eliminar categoría");
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <BackButton /> 
        <Typography variant="h4" gutterBottom>Categorías del Restaurante</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
          Crear Nueva Categoría
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Descripción</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>{categoria.descripcion}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpenForm(categoria)} sx={{ mr: 1 }}>
                      Editar
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleOpenConfirm(categoria)}>
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
            <DialogTitle>{categoriaSeleccionada ? "Editar Categoría" : "Crear Categoría"}</DialogTitle>
            <DialogContent>
              <FormularioCategoria categoriaInicial={categoriaSeleccionada} onGuardar={handleGuardarCategoria} idRestaurante={idRestaurante}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm} color="secondary">Cancelar</Button>
            </DialogActions>
          </Dialog>
        )}

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>¿Seguro que quieres eliminar esta categoría?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="secondary">Cancelar</Button>
            <Button onClick={handleEliminarCategoria} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!error}
          onClose={() => setError(null)}
          message={error}
          autoHideDuration={4000}
        />
      </Container>
    </>
  );
}
