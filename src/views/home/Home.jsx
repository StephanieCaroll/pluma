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
  Fade
} from '@mui/material';

import '@fontsource/monsieur-la-doulaise';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

import { FooterComponent } from '../../MenuSistema';

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#280000',
      light: '#450000',
      dark: '#1a0000'
    },
    secondary: {
      main: '#C7A34F',
      light: '#E8C87E',
      dark: '#A3873A'
    },
    background: {
      default: '#0A0A0A',
      paper: '#121212'
    },
    text: {
      primary: '#F0F0F0',
      secondary: '#C7A34F'
    }
  },
  typography: {
    fontFamily: '"Cinzel", "Playfair Display", serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '0.1em'
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '0.05em'
    },
    h4: {
      color: '#C7A34F',
      fontWeight: 500,
      letterSpacing: '0.05em'
    },
    h5: {
      fontWeight: 400,
      fontStyle: 'italic',
      letterSpacing: '0.03em'
    },
    body1: {
      fontFamily: '"Crimson Text", serif',
      fontSize: '1.1rem',
      lineHeight: 1.6
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          margin: 0,
          padding: 0,
          height: '100%',
          width: '100%',
        },
        '@global': {
          '@font-face': [
            {
              fontFamily: 'Cinzel',
              fontStyle: 'normal',
              fontDisplay: 'swap'
            }
          ],
          body: {
            scrollBehavior: 'smooth'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(199, 163, 79, 0.3)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '8px 24px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        },
        containedSecondary: {
          color: '#0A0A0A',
          '&:hover': {
            backgroundColor: '#E8C87E'
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          border: '1px solid rgba(199, 163, 79, 0.2)',
          borderRadius: '4px',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px -8px rgba(0, 0, 0, 0.6)',
            borderColor: 'rgba(199, 163, 79, 0.4)'
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(199, 163, 79, 0.2)',
          margin: '2rem 0'
        }
      }
    }
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
  },
  {
    id: 3,
    image: 'https://m.media-amazon.com/images/I/71+3JRUaEML._UF1000,1000_QL80_.jpg',
    title: 'Novidades Macabras',
    subtitle: 'Conheça os lançamentos da semana.',
    buttonText: 'Descubra agora'
  }
];

const PromotionalCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <Box sx={{
      width: '100%',
      height: '400px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Slider {...settings}>
        {promoBanners.map((banner) => (
          <Box key={banner.id} sx={{ position: 'relative', height: '400px' }}>
            <Box
              component="img"
              src={banner.image}
              alt={banner.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.30)',
              }}
            />
            <Container sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
              <Typography variant="h2" component="h2" gutterBottom sx={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                {banner.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                {banner.subtitle}
              </Typography>
              <Button variant="contained" color="secondary">
                {banner.buttonText}
              </Button>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

const quotes = [
  {
    text: "O mais antigo e mais forte sentimento da humanidade é o medo, e o mais antigo e mais forte tipo de medo é o medo do desconhecido.",
    author: "H.P. Lovecraft"
  },
  {
    text: "O homem nunca esteve tão próximo de si mesmo quanto quando se sente longe de si.",
    author: "Franz Kafka"
  },
  {
    text: "Não há maior terror do que a escuridão da mente.",
    author: "Edgar Allan Poe"
  },
  {
    text: "O horror sempre nasce de algo que amamos ou desejamos, mas que se corrompe.",
    author: "Clive Barker"
  },
  {
    text: "A loucura é uma fuga para uma realidade que não aguentamos mais.",
    author: "Mary Shelley"
  }
];

const AnimatedQuote = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [inProp, setInProp] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setInProp(false);
      setTimeout(() => {
        setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setInProp(true);
      }, 1000); 
    }, 8000); 

    return () => clearInterval(interval);
  }, []);

  const currentQuote = quotes[quoteIndex];

  return (
    <Fade in={inProp} timeout={{ enter: 1000, exit: 1000 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: 'rgba(40, 0, 0, 0.2)',
          borderLeft: '4px solid',
          borderColor: 'secondary.main',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '300px', md: '310px' }, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&::before': {
            content: '"„"',
            position: 'absolute',
            top: -40,
            left: 20,
            fontSize: '8rem',
            color: 'rgba(199, 163, 79, 0.1)',
            fontFamily: 'Georgia, serif',
            lineHeight: 1
          }
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Monsieur La Doulaise", cursive',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#E8C87E',
            fontWeight: 400,
            fontStyle: 'normal',
            lineHeight: 1.2,
            position: 'relative',
            zIndex: 1
          }}
        >
          "{currentQuote.text}"
        </Typography>
        <Typography
          variant="subtitle1"
          align="right"
          sx={{
            mt: 2,
            color: 'secondary.main',
            fontWeight: 500
          }}
        >
          — {currentQuote.author}
        </Typography>
      </Paper>
    </Fade>
  );
};

const Home = () => {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarLivros = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch('http://localhost:8080/api/livros');
        if (!resposta.ok) throw new Error('Erro ao buscar livros');
        const data = await resposta.json();
        setLivros(data);
        setErro(null);
      } catch (err) {
        setErro('Erro ao carregar livros');
      } finally {
        setCarregando(false);
      }
    };
    carregarLivros();
  }, []);

  // Modal de detalhes do livro
  const [modalAberto, setModalAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const abrirModal = (livro) => {
    setLivroSelecionado(livro);
    setModalAberto(true);
    setMostrarPdf(false);
  };
  const fecharModal = () => {
    setModalAberto(false);
    setLivroSelecionado(null);
    setMostrarPdf(false);
  };

  // Estado para mostrar o PDF embutido no modal
  const [mostrarPdf, setMostrarPdf] = useState(false);

  // Função para montar a URL do PDF pelo nome do arquivo (ajustado para o backend atual)
  // Função para montar a URL do PDF usando o campo urlArquivoPDF do backend
  const getPdfUrl = (livro) => {
    if (!livro || !livro.urlArquivoPDF) return '';
    // Remove barra inicial e 'uploads/' se existir
    let fileName = livro.urlArquivoPDF;
    if (fileName.startsWith('/')) fileName = fileName.substring(1);
    if (fileName.startsWith('uploads/')) fileName = fileName.substring('uploads/'.length);
    return `http://localhost:8080/api/arquivos/livro/` + fileName;
  };

  const abrirPdfLivro = (livro) => {
    setMostrarPdf(true);
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: 'linear-gradient(to bottom, #0A0A0A, #1A1A1A)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(199, 163, 79, 0.05) 0%, transparent 20%)',
              pointerEvents: 'none'
            }
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <PromotionalCarousel />

            <Box component="section" sx={{ py: 8 }}>
              <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h2"
                  align="center"
                  sx={{
                    mb: 6,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80px',
                      height: '2px',
                      backgroundColor: 'secondary.main'
                    }
                  }}
                >
                  Obras Primas
                </Typography>

                {carregando ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <Typography variant="h6" color="secondary">Carregando livros...</Typography>
                  </Box>
                ) : erro ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <Typography variant="h6" color="error">{erro}</Typography>
                  </Box>
                ) : livros.length === 0 ? (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="300px" textAlign="center">
                    <Typography variant="h6" sx={{ color: '#C7A34F', mb: 2 }}>Nenhum livro disponível</Typography>
                    <Typography variant="body1" sx={{ color: '#AAAAAA' }}>
                      Nossa biblioteca está vazia no momento. Volte em breve!
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={4} justifyContent="center">
                    {livros.map((livro) => (
                      <Grid item key={livro.id} xs={12} sm={6} md={3}>
                        <Card sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            boxShadow: '0 12px 20px -8px rgba(0,0,0,0.6)',
                            borderColor: 'rgba(199,163,79,0.4)',
                          }
                        }}>
                          <CardMedia
                            component="img"
                            height="450"
                            image={livro.urlCapa || 'https://via.placeholder.com/300x450?text=Sem+Capa'}
                            alt={livro.titulo}
                            sx={{
                              filter: 'grayscale(20%)',
                              transition: 'filter 0.3s',
                              zIndex: 1
                            }}
                          />
                          <Box
                            className="card-overlay"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(to top, rgba(10, 10, 10, 0.9) 0%, rgba(10, 10, 10, 0.3) 100%)',
                              opacity: 0,
                              transition: 'opacity 0.3s',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              p: 3,
                              pointerEvents: 'none',
                              zIndex: 2
                            }}
                          >
                            <Typography variant="h6" sx={{ color: 'secondary.main', textShadow: '0 2px 8px #0A0A0A' }}>
                              {livro.titulo}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary', mb: 2, textShadow: '0 2px 8px #0A0A0A' }}>
                              {livro.autor}
                            </Typography>
                            <Typography variant="body2" sx={{
                              color: 'text.secondary',
                              fontSize: '0.8rem',
                              fontStyle: 'italic',
                              mb: 2,
                              textShadow: '0 2px 8px #0A0A0A'
                            }}>
                              {livro.descricao}
                            </Typography>
                          </Box>
                          <CardContent sx={{
                            flexGrow: 1,
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 3,
                            backgroundColor: 'rgba(18, 18, 18, 0.7)'
                          }}>
                            <Typography gutterBottom variant="h6" component="div">
                              {livro.titulo}
                            </Typography>
                            <Typography variant="body2" color="secondary">
                              {livro.autor}
                            </Typography>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ mt: 2, width: '100%' }}
                              onClick={() => abrirModal(livro)}
                            >
                              Detalhes
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Container>
            </Box>

            {/* Modal de detalhes do livro */}
            {livroSelecionado && (
              <Fade in={modalAberto}>
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    bgcolor: 'rgba(10,10,10,0.85)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={fecharModal}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      minWidth: { xs: '90vw', md: '700px' },
                      maxWidth: '900px',
                      maxHeight: '90vh',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'auto',
                      position: 'relative',
                      p: 0,
                      boxShadow: '0 8px 32px rgba(40,0,0,0.7)',
                      borderRadius: 3,
                      cursor: 'auto',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Se mostrarPdf, exibe só o PDF */}
                    {mostrarPdf && livroSelecionado && livroSelecionado.id ? (
                      <Box sx={{ width: '100%', height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#222' }}>
                        {getPdfUrl(livroSelecionado) ? (
                          <iframe
                            src={getPdfUrl(livroSelecionado)}
                            title={`PDF de ${livroSelecionado.titulo}`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none', borderRadius: '8px', background: '#222', minHeight: '500px' }}
                            allow="autoplay"
                          />
                        ) : (
                          <Typography variant="body2" color="error" sx={{ mt: 4 }}>
                            PDF não disponível para este livro.
                          </Typography>
                        )}
                        <Button
                          variant="text"
                          color="inherit"
                          sx={{ mt: 2 }}
                          onClick={fecharModal}
                        >
                          Fechar
                        </Button>
                      </Box>
                    ) : (
                      // ...informações do livro...
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
                        {/* Imagem do livro à esquerda */}
                        <Box
                          sx={{
                            width: { xs: '100%', md: '320px' },
                            minHeight: { xs: '220px', md: '100%' },
                            background: 'linear-gradient(135deg, #1a0000 60%, #C7A34F 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2,
                          }}
                        >
                          <Box
                            component="img"
                            src={livroSelecionado.urlCapa || 'https://via.placeholder.com/300x450?text=Sem+Capa'}
                            alt={livroSelecionado.titulo}
                            sx={{
                              width: { xs: '180px', md: '260px' },
                              height: 'auto',
                              maxHeight: { xs: '300px', md: '480px' },
                              objectFit: 'cover',
                              borderRadius: 2,
                              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                              background: '#222',
                              border: '2px solid #C7A34F',
                            }}
                          />
                        </Box>
                        {/* Informações à direita */}
                        <Box
                          sx={{
                            flex: 1,
                            p: { xs: 2, md: 4 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            bgcolor: 'rgba(18,18,18,0.95)',
                            minHeight: { xs: '200px', md: '100%' },
                            gap: 2
                          }}
                        >
                          <Typography variant="h4" sx={{ color: 'secondary.main', mb: 1 }}>
                            {livroSelecionado.titulo}
                          </Typography>
                          <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                            Autor: {livroSelecionado.autor}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                            {livroSelecionado.descricao}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'secondary.main', mb: 1 }}>
                            Gênero: {livroSelecionado.genero || '-'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'secondary.main', mb: 1 }}>
                            Idioma: {livroSelecionado.idioma || '-'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'secondary.main', mb: 1 }}>
                            Número de páginas: {livroSelecionado.numeroPaginas || '-'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'secondary.main', mb: 1 }}>
                            Ano de publicação: {livroSelecionado.anoPublicacao || '-'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'secondary.main', mb: 1 }}>
                            Estoque: {livroSelecionado.estoque || '-'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'secondary.main', mb: 1 }}>
                            Preço: {livroSelecionado.preco ? `R$ ${livroSelecionado.preco}` : '-'}
                          </Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 1, alignSelf: 'flex-start' }}
                            onClick={() => abrirPdfLivro(livroSelecionado)}
                            disabled={!livroSelecionado.id}
                          >
                            Comprar Livro
                          </Button>
                          <Button
                            variant="text"
                            color="inherit"
                            sx={{ alignSelf: 'flex-start', mb: 1 }}
                            onClick={fecharModal}
                          >
                            Fechar
                          </Button>
                          {!livroSelecionado.id && (
                            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                              PDF não disponível para este livro.
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Fade>
            )}

            <Box component="section" sx={{ py: 10, backgroundColor: 'rgba(10, 10, 10, 0.5)' }}>
              <Container maxWidth="lg">
                <AnimatedQuote />
              </Container>
            </Box>
          </Box>
        </Box>
        <FooterComponent />
      </>
    </ThemeProvider>
  );
};

export default Home;
