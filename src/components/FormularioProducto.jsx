import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from "@mui/material";
import { NumericFormat } from 'react-number-format';
import productoService from "../services/productoService";
import categoryService from "../services/categoryService";
import { useParams } from 'react-router-dom';

export default function FormularioProducto({ productoInicial, onGuardar }) {
  const { idRestaurante } = useParams();

  const [producto, setProducto] = useState({
    id_restaurante: idRestaurante,
    id_producto: "",
    nombre: "",
    descripcion: "",
    categoria_id: "",
    foto: "",
    precio: "",
    disponible: true,
  });

  const [categorias, setCategorias] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (productoInicial) {
      setProducto({
        ...productoInicial,
        id_restaurante: productoInicial.id_restaurante,
        id_producto: productoInicial.id || "",
        disponible: productoInicial.disponible || true,
      });
      setPreview(productoInicial.foto ? `${process.env.REACT_APP_BACKEND_URL}${productoInicial.foto}` : "/img/restaurantes/default.jpg");
    }
  }, [productoInicial]);

  useEffect(() => {
    const cargarCategorias = async () => {
      const categoriasData = await categoryService.obtenerCategorias(idRestaurante);
      setCategorias(categoriasData);
    };
    cargarCategorias();
  }, [idRestaurante]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSwitchChange = (e) => {
    setProducto({ ...producto, disponible: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id_producto, ...productoSinId } = producto;
    const productoFinal = {
      ...productoSinId,
      id_restaurante: Number(producto.id_restaurante),
      precio: Number(producto.precio),
    };

    try {
      if (productoFinal.foto instanceof File) {
        const imageUrl = await productoService.subirImagen(productoFinal.foto);
        onGuardar({ ...productoFinal, foto: imageUrl });
      } else {
        onGuardar(productoFinal);
      }
    } catch (error) {
      console.error("Error al procesar el producto:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProducto({ ...producto, foto: file });
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
          {producto.id ? "Editar Producto" : "Crear Producto"}
        </Typography>

        <Typography variant="subtitle1" sx={{ color: "gray" }}>
          ID Restaurante: {producto.id_restaurante}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Nombre del Producto" name="nombre" value={producto.nombre} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Descripción" name="descripcion" value={producto.descripcion} onChange={handleChange} margin="normal" multiline rows={3} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select name="categoria_id" value={producto.categoria_id} onChange={handleChange} required>
              {categorias.length > 0 ? (
                categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando...</MenuItem>
              )}
            </Select>
          </FormControl>

          <NumericFormat
            fullWidth
            customInput={TextField}
            label="Precio"
            name="precio"
            value={producto.precio}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            onValueChange={(values) => setProducto({ ...producto, precio: values.value })}
            margin="normal"
            required
          />

          <FormControlLabel control={<Switch checked={producto.disponible} onChange={handleSwitchChange} />} label="Disponible" />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Button variant="contained" component="label">
              Subir Foto
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {preview && <img src={preview} alt="Vista previa" style={{ width: "150px", borderRadius: "8px" }} />}
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={!producto.nombre || !producto.precio || !producto.categoria_id}>
            Guardar
          </Button>
        </form>
      </Box>
    </Container>
  );
}
