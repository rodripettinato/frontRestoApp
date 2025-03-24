import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid2, Typography, Box } from '@mui/material';
import mesaService from '../services/mesaService';
import { useParams } from 'react-router-dom';

export default function FormularioMesas({ mesaInicial, onGuardar }) {
  const [numero_mesa, setNumeroMesa] = useState('');
  const [qr, setQr] = useState('');

  const { idRestaurante } = useParams();

  useEffect(() => {
    if (mesaInicial) {
      setNumeroMesa(mesaInicial.numero_mesa);
      setQr(mesaInicial.qr);
    }
  }, [mesaInicial]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mesa = {
      numero_mesa: Number(numero_mesa),
      id_restaurante: Number(idRestaurante),
      qr: "", 
    };

    try {
      let respuesta;
      if (mesaInicial) {
        respuesta = await mesaService.actualizarMesa(mesaInicial.id, mesa);
      } else {
        respuesta = await mesaService.crearMesa(mesa);
      }
      
      onGuardar(respuesta);
    } catch (error) {
      console.error("Error al guardar la mesa", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {mesaInicial ? 'Editar Mesa' : 'Agregar Nueva Mesa'}
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Número de Mesa"
            fullWidth
            value={numero_mesa}
            onChange={(e) => setNumeroMesa(e.target.value)}
            required
          />
        </Grid2>
        {qr && (
          <Grid2 size={{ xs: 12}}>
            <Typography variant="body1">QR generado para esta mesa:</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <img src={`${process.env.REACT_APP_BACKEND_URL}/${qr}`} alt={`QR Mesa ${numero_mesa}`} style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
          </Grid2>
        )}

        <Grid2 size={{ xs: 12}}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {mesaInicial ? 'Actualizar Mesa' : 'Agregar Mesa'}
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
}