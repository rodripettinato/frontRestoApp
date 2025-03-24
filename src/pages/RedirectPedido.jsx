import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RedirectPedido() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const merchantOrderId = params.get('merchant_order_id');
    if (merchantOrderId) {
      navigate(`/pedido/${merchantOrderId}`);
    }
  }, [location.search, navigate]);

  return null;
}
