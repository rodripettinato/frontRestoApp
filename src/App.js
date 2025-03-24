import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas
import Restaurantes from './pages/Restaurantes';
import ListadoCategorias from './pages/ListadoCategorias';
import CartaRestaurante from './pages/CartaRestaurante';
import Carrito from './pages/Carrito';
import ListadoProductos from './pages/ListadoProductos';
import AdminDashboard from './pages/AdminDashboard';
import ListadoMesas from './pages/ListadoMesas';
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ListadoRestaurantesAdmin from "./pages/ListadoRestaurantesAdmin";
import Estadisticas from "./pages/Estadisticas";
import VentasAdmin from "./pages/VentasAdmin";
import Pedido from "./pages/Pedido";
import RedirectPedido from "./pages/RedirectPedido";
import PagoErroneo from "./pages/PagoErroneo";

function App() {
  return (
    <>
      <Router>

        <Routes>
          <Route path="/" element={<Restaurantes />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/mis-restaurantes" element={<ProtectedRoute><ListadoRestaurantesAdmin /></ProtectedRoute>} />
          <Route path="/dashboard/:idRestaurante" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/:idRestaurante/categorias" element={<ProtectedRoute><ListadoCategorias /></ProtectedRoute>} />
          <Route path="/dashboard/:idRestaurante/mesas" element={<ProtectedRoute><ListadoMesas /></ProtectedRoute>} />
          <Route path="/dashboard/:idRestaurante/productos" element={<ProtectedRoute><ListadoProductos /></ProtectedRoute>} />
          <Route path="/dashboard/:idRestaurante/estadisticas" element={<ProtectedRoute><Estadisticas /></ProtectedRoute>} />
          <Route path="/dashboard/:idRestaurante/ventas" element={<ProtectedRoute><VentasAdmin /></ProtectedRoute>} /> 

          <Route path="/carta/:restauranteId/mesa/:mesaNumero" element={<CartaRestaurante />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pedido" element={<RedirectPedido />} />
          <Route path="/pedido/:merchantOrderId" element={<Pedido/>} />
          <Route path="/pago_erroneo/:estado" element={<PagoErroneo/>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
