import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';

export default function RestauranteCard({ nombre, direccion, imagen }) { 
    const handleVerEnMapa = () => {
        const url = `${process.env.REACT_APP_GOOGLE_MAPS_SEARCH}${encodeURIComponent(direccion)}`;
        window.open(url, '_blank');
    };

    return (
    <Card sx={{ minWidth: 300, maxWidth: 345, margin: 1}}>
        <CardMedia
          component="img"
          height="140"
          image={imagen}
          alt={nombre}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {nombre}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {direccion}
          </Typography>
        </CardContent>
      <CardActions>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Button size="small" color="primary" onClick={handleVerEnMapa}>
            Ver en el mapa
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}