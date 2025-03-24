import { Button } from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBack />}
      onClick={() => navigate(-1)}
      sx={{ mb: 2 }}
    >
      Volver
    </Button>
  );
}
