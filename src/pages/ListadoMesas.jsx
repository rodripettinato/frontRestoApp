import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import mesaService from '../services/mesaService';
import FormularioMesas from '../components/FormularioMesa';
import BackButton from "../components/BackButton"; 
import { useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function ListadoMesas() {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const { idRestaurante } = useParams();

  useEffect(() => {
    mesaService.obtenerMesas(idRestaurante)
      .then(response => setMesas(response))
      .catch(error => console.error('Error al cargar mesas:', error));
  }, [idRestaurante]);

  const handleOpenForm = (mesa = null) => {
    setMesaSeleccionada(mesa);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setMesaSeleccionada(null);
  };

  const handleGuardarMesa = (mesa) => {
    if (mesaSeleccionada) {
       setMesas(prev => prev.map(m => m.id === mesaSeleccionada.id ? mesa : m));
       handleCloseForm();
    } else {
        setMesas(prev => [...prev, mesa]);
        handleCloseForm();
    }
  };

  const handleEliminarMesa = (id) => {
    mesaService.eliminarMesa(id)
      .then(() => {
        setMesas(prev => prev.filter(m => m.id !== id));
      })
      .catch(error => console.error('Error al eliminar mesa:', error));
  };

  const handleDescargarQR = (qr, numero_mesa) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/${qr}`)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `QR_Mesa_${numero_mesa}.png`;
        link.click();
      })
      .catch(error => console.error('Error al descargar el archivo:', error));
  };

  return (
    <>
    <Navbar />
    <Container maxWidth="lg">
      <BackButton /> 
      <Typography variant="h4" gutterBottom>Gestión de Mesas</Typography>
      
      <Button variant="contained" color="primary" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
        Agregar Nueva Mesa
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Número de Mesa</strong></TableCell>
              <TableCell><strong>QR</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mesas.map((mesa) => (
              <TableRow key={mesa.id}>
                <TableCell>{mesa.numero_mesa}</TableCell>
                <TableCell>
                  <img src={`${process.env.REACT_APP_BACKEND_URL}/${mesa.qr}`} alt={`QR Mesa ${mesa.numero_mesa}`} style={{ maxWidth: '100px' }} />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpenForm(mesa)} sx={{ mr: 1 }}>
                    Editar
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleEliminarMesa(mesa.id)} sx={{ mr: 1 }}>
                    Eliminar
                  </Button>
                  <Button variant="contained" color="success" onClick={() => handleDescargarQR(mesa.qr, mesa.numero_mesa)}>
                    Descargar QR
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openForm && (
        <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
          <DialogTitle>{mesaSeleccionada ? 'Editar Mesa' : 'Agregar Nueva Mesa'}</DialogTitle>
          <DialogContent>
            <FormularioMesas mesaInicial={mesaSeleccionada} onGuardar={handleGuardarMesa} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} color="secondary">Cancelar</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
    </>
  );
}