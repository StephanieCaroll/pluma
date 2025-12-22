import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
  Modal,
  Fade,
  Backdrop,
  IconButton,
  CircularProgress,
  Divider,
  InputBase
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuBook from '@mui/icons-material/MenuBook';
import Inventory from '@mui/icons-material/Inventory';
import Language from '@mui/icons-material/Language';
import CalendarToday from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';

import { FooterComponent } from '../../MenuSistema';

import '@fontsource/cinzel';
import '@fontsource/crimson-text';
import '@fontsource/monsieur-la-doulaise';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Estilização da barra de pesquisa
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha('#C7A34F', 0.1),
  '&:hover': {
    backgroundColor: alpha('#C7A34F', 0.2),
  },
  marginLeft: 0,
  width: '100%',
  border: `1px solid ${alpha('#C7A34F', 0.3)}`
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#C7A34F',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  fontFamily: '"Crimson Text", serif',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  border: '2px solid',
  borderColor: 'secondary.main',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  textAlign: 'center',
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 4
};

const ListProduto = () => {
  const [open, setOpen] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const iframeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarLivros = async () => {
      try {
        setCarregando(true);
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search') || '';
        
        // Atualiza o estado local com o termo da URL
        setSearchTerm(search);
        
        let url = '/livros';
        if (search) {
          url = `/livros/search?termo=${search}`;
        }
        
        console.log('Fazendo requisição para:', url);
        const resposta = await api.get(url);
        
        console.log('Dados recebidos:', resposta.data);
        setLivros(resposta.data);
        setErro(null);
      } catch (err) {
        console.error('Erro ao carregar livros:', err);
        setErro('Erro ao carregar livros. Tente recarregar a página.');
      } finally {
        setCarregando(false);
      }
    };
    
    carregarLivros();
  }, [location.search]);

  const handleOpen = (produto) => {
    setSelectedProduto(produto);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOpenPdf = () => {
    setOpenPdf(true);
    setCurrentPage(1);
  };

  const handleClosePdf = () => {
    setOpenPdf(false);
    setCurrentPage(1);
    setTotalPages(0);
  };

  const handleToggleFavorito = (produtoId, event) => {
    event.stopPropagation();
    if (favoritos.includes(produtoId)) {
      setFavoritos(favoritos.filter(id => id !== produtoId));
    } else {
      setFavoritos([...favoritos, produtoId]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/list-produto?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/list-produto');
    }
  };

  const ehFavorito = (produtoId) => {
    return favoritos.includes(produtoId);
  };

  const getPdfUrl = (urlArquivoPDF) => {
    if (!urlArquivoPDF) return null;
    const nomeArquivo = urlArquivoPDF.split('/').pop();
    return `http://localhost:8080/api/arquivos/livro/${encodeURIComponent(nomeArquivo)}`;
  };

  const handlePrevPage = () => {
    if (iframeRef.current) {
        iframeRef.current.contentWindow.history.back();
    }
  };

  const handleNextPage = () => {
    if (iframeRef.current) {
        iframeRef.current.contentWindow.history.forward();
    }
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
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
        <Box sx={{ flexGrow: 1, py: 8 }}>
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
              {searchTerm ? `Resultados para: "${searchTerm}"` : 'Nossas Obras'}
            </Typography>

            {/* Barra de pesquisa adicionada aqui */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <Search component="form" onSubmit={handleSearch} sx={{ 
                width: '100%',
                maxWidth: 600,
                mx: 2
              }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Pesquisar livros, autores..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Search>
            </Box>

            {carregando ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress sx={{ color: '#C7A34F' }} />
              </Box>
            ) : erro ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Typography color="error" variant="h6">{erro}</Typography>
              </Box>
            ) : livros.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="300px" textAlign="center">
                <Typography variant="h6" sx={{ color: '#C7A34F', mb: 2 }}>
                  {searchTerm ? `Nenhum resultado encontrado para "${searchTerm}"` : 'Nenhum livro disponível'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#AAAAAA' }}>
                  {searchTerm ? 'Tente usar termos diferentes' : 'Nossa biblioteca está vazia no momento. Volte em breve!'}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4} justifyContent="center">
                {livros.map((livro) => (
                  <Grid item key={livro.id} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px -8px rgba(0, 0, 0, 0.6)',
                          borderColor: 'rgba(199, 163, 79, 0.4)'
                        }
                      }}
                      onClick={() => handleOpen(livro)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={livro.urlCapa || 'https://via.placeholder.com/300x450?text=Sem+Capa'}
                          alt={livro.titulo}
                          sx={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '250px',
                            filter: 'grayscale(20%)',
                            transition: 'filter 0.3s ease',
                            '&:hover': {
                              filter: 'none'
                            }
                          }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=Sem+Capa'}
                        />
                        <IconButton 
                          onClick={(e) => handleToggleFavorito(livro.id, e)}
                          sx={{ 
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: ehFavorito(livro.id) ? '#FF4081' : '#FFFFFF',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)'
                            }
                          }}
                        >
                          {ehFavorito(livro.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" sx={{ 
                          color: '#C7A34F',
                          fontWeight: 'bold',
                          minHeight: '64px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {livro.titulo}
                        </Typography>
                        <Typography color="#AAAAAA" gutterBottom sx={{ fontStyle: 'italic' }}>
                          {livro.autor}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1} mb={1}>
                          <MenuBook fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                          <Typography variant="body2" color="#AAAAAA">
                            {livro.numeroPaginas} páginas
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
        
        {/* Modal de Detalhes do Produto */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={modalStyle}>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'secondary.main',
                }}
              >
                <CloseIcon />
              </IconButton>
              {selectedProduto && (
                <>
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: 'auto',
                        maxHeight: '400px',
                        borderRadius: '4px',
                        border: '1px solid rgba(199, 163, 79, 0.2)',
                        objectFit: 'contain'
                      }}
                      image={selectedProduto.urlCapa || 'https://via.placeholder.com/400x600?text=Sem+Capa'}
                      alt={selectedProduto.titulo}
                    />
                  </Box>
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography id="transition-modal-title" variant="h4" component="h2" gutterBottom sx={{ color: '#C7A34F' }}>
                      {selectedProduto.titulo}
                    </Typography>
                    <Typography variant="h6" color="#AAAAAA" gutterBottom sx={{ fontStyle: 'italic' }}>
                      {selectedProduto.autor}
                    </Typography>
                    <Divider sx={{ my: 2, backgroundColor: 'rgba(199, 163, 79, 0.2)' }} />
                    <Typography id="transition-modal-description" sx={{ mt: 2, mb: 4, fontFamily: '"Crimson Text", serif', color: '#CCCCCC' }}>
                      {selectedProduto.descricao || "Nenhuma descrição disponível."}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <Inventory fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                          <Typography variant="body2" color="#AAAAAA">
                            <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Gênero:</Box> {selectedProduto.genero}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <Language fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                          <Typography variant="body2" color="#AAAAAA">
                            <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Idioma:</Box> {selectedProduto.idioma}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <MenuBook fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                          <Typography variant="body2" color="#AAAAAA">
                            <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Páginas:</Box> {selectedProduto.numeroPaginas}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                          <CalendarToday fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                          <Typography variant="body2" color="#AAAAAA">
                            <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Ano:</Box> {selectedProduto.anoPublicacao}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: { md: 'flex-start' }, mt: 4 }}>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        sx={{ flexGrow: { xs: 1, md: 'unset' } }}
                        onClick={handleOpenPdf}
                        disabled={!selectedProduto.urlArquivoPDF}
                      >
                        Ler Livro
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={ehFavorito(selectedProduto.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        sx={{ flexGrow: { xs: 1, md: 'unset' } }}
                        onClick={(e) => handleToggleFavorito(selectedProduto.id, e)}
                      >
                        {ehFavorito(selectedProduto.id) ? 'Favoritado' : 'Favoritar'}
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>

        {/* Modal de Visualização de PDF */}
        <Modal
          open={openPdf}
          onClose={handleClosePdf}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openPdf}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%',
              maxWidth: '1200px',
              height: '90vh',
              bgcolor: 'background.paper',
              border: '2px solid #C7A34F',
              boxShadow: 24,
              p: 0,
              outline: 'none'
            }}>
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1E1E1E'
              }}>
                <Box sx={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: '#C7A34F',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 16px'
                }}>
                  <Typography variant="h6" sx={{ color: '#1E1E1E' }}>
                    {selectedProduto?.titulo}
                  </Typography>
                  <IconButton onClick={handleClosePdf} sx={{ color: '#1E1E1E' }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                
                <Box sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#2A2A2A',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {selectedProduto?.urlArquivoPDF ? (
                    <Box sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Box sx={{
                        width: '95%',
                        height: '95%',
                        display: 'flex',
                        position: 'relative',
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: '1px solid rgba(199, 163, 79, 0.2)',
                          borderRadius: '4px',
                          pointerEvents: 'none'
                        }
                      }}>
                        <iframe
                          ref={iframeRef}
                          src={getPdfUrl(selectedProduto.urlArquivoPDF)}
                          width="100%"
                          height="100%"
                          style={{ border: 'none' }}
                          title="Visualizador de PDF"
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="h6" sx={{ color: '#C7A34F' }}>
                      PDF não disponível para este livro
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    
     <FooterComponent />

    </ThemeProvider>
  );
};

export default ListProduto;