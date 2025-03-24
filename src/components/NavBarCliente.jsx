import { useState } from "react";
import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Snackbar } from '@mui/material';
import { Home, ShoppingCart, PhoneInTalk } from '@mui/icons-material';
import io from "socket.io-client";

export default function NavbarCliente () {
    const idRestaurante = localStorage.getItem("restauranteId");
    const mesaNumero = localStorage.getItem("mesaNumero");
    
    const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);
    
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const llamarMozo = () => {
        socket.emit("llamar_mozo", { idMesa: mesaNumero, idRestaurante: idRestaurante });
        console.log("Pedi mozo");
        setOpenSnackbar(true);

        setTimeout(() => {
          setOpenSnackbar(false);
        }, 3000);
      };

  return (
    <>
    <BottomNavigation
      showLabels
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        backgroundColor: '#333',
        zIndex: 1000,
      }}
    >
      <BottomNavigationAction
        label="Productos"
        component={Link}
        to={`/carta/${idRestaurante}/mesa/${mesaNumero}`}
        icon={<Home />}
        sx={{
          color: 'white',
        }}
      />
      <BottomNavigationAction
        label="Llamar Mozo"
        component={Link}
        onClick={llamarMozo}
        icon={<PhoneInTalk />}
        sx={{
          color: 'white',
        }}
      />
      <BottomNavigationAction
        label="Carrito"
        component={Link}
        to="/carrito"
        icon={<ShoppingCart />}
        sx={{
          color: 'white',
        }}
      />
    </BottomNavigation>
    <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message="Mozo solicitado"
            sx={{mb: 8}}
    />
    </>
  );
};