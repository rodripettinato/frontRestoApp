import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import productoService from "../services/productoService";
import FormularioProducto from "../components/FormularioProducto";
import BackButton from "../components/BackButton";
import categoryService from "../services/categoryService";
import { useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function ListadoProductos() {
  const [productos, setProductos] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const { idRestaurante } = useParams();

  const [categorias, setCategorias] = useState({});

  useEffect(() => {
    async function cargarDatos() {
      try {
        const categoriasData = await categoryService.obtenerCategorias(idRestaurante);
        const categoriasMap = categoriasData.reduce((acc, categoria) => {
          acc[categoria.id] = categoria.nombre;
          return acc;
        }, {});
        setCategorias(categoriasMap);

        const productosData = await productoService.obtenerProductosPorRestaurante(idRestaurante);

        const agrupados = productosData.reduce((acc, producto) => {
          const categoriaNombre = categoriasMap[producto.categoria_id] || "Sin categoría";
          if (!acc[categoriaNombre]) acc[categoriaNombre] = [];
          acc[categoriaNombre].push(producto);
          return acc;
        }, {});
        setProductosPorCategoria(agrupados);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }

    cargarDatos();
  }, [idRestaurante]);

  const handleOpenForm = (producto = null) => {
    setProductoSeleccionado(producto);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setProductoSeleccionado(null);
  };

  const handleGuardarProducto = async (producto) => {
    try {
      if (producto.id) {
        await productoService.editarProducto(producto);
        setProductos(prev =>
          prev.map(p => (p.id === producto.id ? producto : p))
        );
        const categoriaNombre = categorias[producto.categoria_id] || "Sin categoría";
        setProductosPorCategoria(prev => {
          const nuevosProductos = { ...prev };
          if (nuevosProductos[categoriaNombre]) {
            nuevosProductos[categoriaNombre] = nuevosProductos[categoriaNombre].map(p =>
              p.id === producto.id ? producto : p
            );
          }
          return nuevosProductos;
        });
      } else {
        const nuevoProducto = await productoService.crearProducto(producto);
        if (!productos.some(p => p.id === nuevoProducto.id)) {
          setProductos(prev => [...prev, nuevoProducto]);
          const categoriaNombre = categorias[nuevoProducto.categoria_id] || "Sin categoría";
          setProductosPorCategoria(prev => {
            const nuevosProductos = { ...prev };
            if (!nuevosProductos[categoriaNombre]) {
              nuevosProductos[categoriaNombre] = [];
            }
            if (!nuevosProductos[categoriaNombre].some(p => p.id === nuevoProducto.id)) {
              nuevosProductos[categoriaNombre].push(nuevoProducto);
            }
            return nuevosProductos;
          });
        }
      }

      handleCloseForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenConfirm = (producto) => {
    setProductoAEliminar(producto);
    setOpenConfirm(true);
  };

  const handleEliminarProducto = async () => {
    try {
      await productoService.eliminarProducto(productoAEliminar.id);
      setProductos(prev => prev.filter(p => p.id !== productoAEliminar.id));
      setOpenConfirm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <BackButton />
        <Typography variant="h4" gutterBottom>Productos del Restaurante</Typography>

        <Button variant="contained" color="primary" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
          Crear Nuevo Producto
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Imagen</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Precio</strong></TableCell>
                <TableCell><strong>Disponible</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(productosPorCategoria).map(([categoria, productos]) => (
                <React.Fragment key={categoria}>
                  <TableRow>
                    <TableCell colSpan={5} style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
                      {categoria}
                    </TableCell>
                  </TableRow>
                  {productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <img
                          src={producto.foto ? `${process.env.REACT_APP_BACKEND_URL}${producto.foto}` : "/img/restaurantes/default.jpg"}
                          alt={producto.nombre}
                          style={{ width: 50, height: 50, borderRadius: 5 }}
                        />
                      </TableCell>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(producto.precio)}</TableCell>
                      <TableCell>{producto.disponible ? "Sí" : "No"}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleOpenForm(producto)} sx={{ mr: 1 }}>
                          Editar
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleOpenConfirm(producto)}>
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {openForm && (
          <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
            <DialogTitle>{productoSeleccionado ? "Editar Producto" : "Crear Producto"}</DialogTitle>
            <DialogContent>
              <FormularioProducto productoInicial={productoSeleccionado} onGuardar={handleGuardarProducto} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm} color="secondary">Cancelar</Button>
            </DialogActions>
          </Dialog>
        )}

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>¿Seguro que quieres eliminar este producto?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="secondary">Cancelar</Button>
            <Button onClick={handleEliminarProducto} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
