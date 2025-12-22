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
  Divider,
  CircularProgress
} from '@mui/material';

import '@fontsource/monsieur-la-doulaise';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

import { supabase } from '../../services/supabaseClient';
import { FooterComponent } from '../../MenuSistema';

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#280000', light: '#450000', dark: '#1a0000' },
    secondary: { main: '#C7A34F', light: '#E8C87E', dark: '#A3873A' },
    background: { default: '#0A0A0A', paper: '#121212' },
    text: { primary: '#F0F0F0', secondary: '#C7A34F' }
  },
  typography: {
    fontFamily: '"Cinzel", "Playfair Display", serif',
    h2: { fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.05em' },
    body1: { fontFamily: '"Crimson Text", serif', fontSize: '1.1rem', lineHeight: 1.6 }
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
    subtitle: 'Até 50% de desconto em títulos selecionados.',
    buttonText: 'Ver promoções'
  }
];

const PromotionalCarousel = () => {
  const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 5000, arrows: false };
  return (
    <Box sx={{ width: '100%', height: '450px', position: 'relative', overflow: 'hidden' }}>
      <Slider {...settings}>
        {promoBanners.map((banner) => (
          <Box key={banner.id} sx={{ position: 'relative', height: '450px' }}>
            <Box component="img" src={banner.image} sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
            <Container sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <Typography variant="h2" sx={{ color: 'white', textShadow: '2px 2px 10px #000', mb: 2 }}>{banner.title}</Typography>
              <Typography variant="h5" sx={{ color: 'secondary.light', mb: 3 }}>{banner.subtitle}</Typography>
              <Button variant="contained" color="secondary">{banner.buttonText}</Button>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

const quotes = [
  { text: "O mais antigo e mais forte sentimento da humanidade é o medo, e o mais antigo e mais forte tipo de medo é o medo do desconhecido.", author: "H.P. Lovecraft" },
  { text: "Não há maior terror do que a escuridão da mente.", author: "Edgar Allan Poe" }
];

const AnimatedQuote = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % quotes.length), 8000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Paper sx={{ p: 6, bgcolor: 'rgba(40, 0, 0, 0.1)', borderLeft: '5px solid #C7A34F', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontFamily: '"Monsieur La Doulaise", cursive', color: '#E8C87E', mb: 2 }}>
        "{quotes[index].text}"
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'secondary.main' }}>— {quotes[index].author}</Typography>
    </Paper>
  );
};

const Home = () => {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarLivrosAleatorios = async () => {
      try {
        setCarregando(true);
        
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .limit(10); 

        if (error) throw error;

        const embaralhados = data
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        setLivros(embaralhados || []);
      } catch (err) {
        console.error('Erro ao buscar livros:', err.message);
      } finally {
        setCarregando(false);
      }
    };
    carregarLivrosAleatorios();
  }, []);

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
        <PromotionalCarousel />

        <Container maxWidth="xl" sx={{ py: 10 }}>
          <Typography variant="h2" align="center" sx={{ color: 'secondary.main', mb: 6, fontFamily: 'Cinzel' }}>
            Obras Imortais
          </Typography>

          {carregando ? (
            <Box display="flex" justifyContent="center" py={10}>
              <CircularProgress color="secondary" />
            </Box>
          ) : livros.length === 0 ? (
            <Typography align="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>Nenhuma obra encontrada no acervo.</Typography>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {livros.map((livro) => (
                <Grid item key={livro.id} xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    height: '560px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: '1px solid rgba(199, 163, 79, 0.2)',
                    transition: '0.3s',
                    borderRadius: 0,
                    '&:hover': { transform: 'translateY(-10px)', borderColor: '#C7A34F' }
                  }}>
                    <CardMedia
                      component="img"
                      height="380"
                      image={livro.url_capa || 'https://via.placeholder.com/300x450'}
                      alt={livro.titulo}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                      <Typography variant="h6" sx={{ color: 'secondary.main', fontSize: '1.1rem', mb: 0.5,display: '-webkit-box',WebkitLineClamp: 2,WebkitBoxOrient: 'vertical',overflow: 'hidden',height: '2.8rem'
                      }}>
                        {livro.titulo}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                        {livro.autor}
                      </Typography>

                      <Typography variant="h6" sx={{ color: '#F0F0F0', fontWeight: 'bold', mb: 2 }}>
                        {formatarPreco(livro.preco)}
                      </Typography>

                      <Button variant="outlined" color="secondary" href="/list-produto" sx={{ mt: 'auto' }}>
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ mt: 10 }}>
            <AnimatedQuote />
          </Box>
        </Container>

        <FooterComponent />
      </Box>
    </ThemeProvider>
  );
};

export default Home;