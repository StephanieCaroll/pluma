import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Typography,
  Box,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CssBaseline,
  Paper,
  Fade,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import '@fontsource/monsieur-la-doulaise';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

// IMPORTAÇÕES DO SEU PROJETO
import { supabase } from '../../services/supabaseClient';
import { FooterComponent } from '../../MenuSistema';

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#280000' },
    secondary: { main: '#C7A34F' },
    background: { default: '#0A0A0A', paper: '#121212' },
    text: { primary: '#F0F0F0', secondary: '#C7A34F' }
  },
  typography: {
    fontFamily: '"Cinzel", "Playfair Display", serif',
    h2: { fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.05em' },
    body1: { fontFamily: '"Crimson Text", serif', fontSize: '1.1rem' }
  }
});

const promoBanners = [
  {
    id: 1,
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3Nw4EDdEW-Sg3tXj4Z5t4C85y-uahCzplAxGbaqZgqa5vsR1CqU5Ql8AOOJkCRiq8kKlPHz1V0-9wOQltiFiGOfXNz40TqVwH1QYoLUaIk1YPa6U3m078A0pypZiJyyMO-jP7P3CfVYs/s1600/os-cinco-melhores-livros-goticos-de-todos-os-tempos.jpg',
    title: 'A Coleção Gótica',
    subtitle: 'Compre 3, leve 4.',
    buttonText: 'Explorar'
  },
  {
    id: 2,
    image: 'https://a-static.mlcdn.com.br/800x600/livro-grandes-classicos-goticos-box-com-3-livros/temtudoguarulhos/9786585168335/3a8e5de9930d0369fd553085db2949d6.jpg',
    title: 'Horrores Clássicos',
    subtitle: 'Até 50% de desconto.',
    buttonText: 'Ver promoções'
  }
];

const quotes = [
  { text: "O mais antigo e mais forte sentimento da humanidade é o medo do desconhecido.", author: "H.P. Lovecraft" },
  { text: "Não há maior terror do que a escuridão da mente.", author: "Edgar Allan Poe" }
];

const PromotionalCarousel = () => {
  const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 5000 };
  return (
    <Box sx={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden' }}>
      <Slider {...settings}>
        {promoBanners.map((banner) => (
          <Box key={banner.id} sx={{ position: 'relative', height: '400px' }}>
            <Box component="img" src={banner.image} sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
            <Container sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <Typography variant="h2" sx={{ color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>{banner.title}</Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>{banner.subtitle}</Typography>
              <Button variant="contained" color="secondary">Explorar</Button>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

const AnimatedQuote = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % quotes.length), 8000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Paper sx={{ p: 4, bgcolor: 'rgba(40, 0, 0, 0.2)', borderLeft: '4px solid #C7A34F', minHeight: '200px' }}>
      <Typography variant="h4" sx={{ fontFamily: '"Monsieur La Doulaise", cursive', color: '#E8C87E', mb: 2 }}>
        "{quotes[index].text}"
      </Typography>
      <Typography variant="subtitle1" align="right" sx={{ color: 'secondary.main' }}>— {quotes[index].author}</Typography>
    </Paper>
  );
};

const Home = () => {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDestaques = async () => {
      try {
        setCarregando(true);
        // BUSCANDO DO SUPABASE EM VEZ DO LOCALHOST
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .limit(4); // Pega apenas 4 livros para o destaque da Home
        
        if (error) throw error;
        setLivros(data || []);
      } catch (err) {
        console.error('Erro ao carregar livros na Home:', err);
      } finally {
        setCarregando(false);
      }
    };
    carregarDestaques();
  }, []);

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
        <PromotionalCarousel />

        <Box sx={{ flexGrow: 1, py: 8 }}>
          <Container maxWidth="xl">
            <Typography variant="h2" align="center" sx={{ mb: 6, color: 'secondary.main', position: 'relative' }}>
              Obras Primas
              <Box sx={{ width: '80px', height: '2px', bgcolor: 'secondary.main', mx: 'auto', mt: 2 }} />
            </Typography>

            {carregando ? (
              <Box display="flex" justifyContent="center" py={10}><CircularProgress color="secondary" /></Box>
            ) : (
              <Grid container spacing={4} justifyContent="center">
                {livros.map((livro) => (
                  <Grid item key={livro.id} xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="400"
                        image={livro.url_capa || 'https://via.placeholder.com/300x450?text=Sem+Capa'}
                        alt={livro.titulo}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ textAlign: 'center', bgcolor: 'rgba(18,18,18,0.8)' }}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>{livro.titulo}</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{livro.autor}</Typography>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          fullWidth
                          onClick={() => navigate('/list-produto')}
                        >
                          Detalhes
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                size="large"
                onClick={() => navigate('/list-produto')}
              >
                Ver Catálogo Completo
              </Button>
            </Box>
          </Container>
        </Box>

        <Box sx={{ py: 10, bgcolor: 'rgba(10, 10, 10, 0.5)' }}>
          <Container maxWidth="lg">
            <AnimatedQuote />
          </Container>
        </Box>

        <FooterComponent />
      </Box>
    </ThemeProvider>
  );
};

export default Home;