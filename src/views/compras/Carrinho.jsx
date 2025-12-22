import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  IconButton,
  Divider,
  CssBaseline,
  Fade
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import '@fontsource/cinzel';
import '@fontsource/crimson-text';

// O tema foi replicado aqui para que o componente seja autossuficiente.
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
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 18, 18, 0.8)',
          border: '1px solid rgba(199, 163, 79, 0.2)',
          backdropFilter: 'blur(4px)'
        }
      }
    }
  }
});

// Dados de exemplo para o carrinho
const mockCartItems = [
  { id: 1, name: 'Diário de um Lorde', price: 29.99, quantity: 1, imageUrl: 'https://placehold.co/100x150/1a1a1a/c7a34f?text=Livro+1' },
  { id: 2, name: 'Poesias da Meia-Noite', price: 19.50, quantity: 2, imageUrl: 'https://placehold.co/100x150/1a1a1a/c7a34f?text=Livro+2' },
  { id: 3, name: 'Contos do Crepúsculo', price: 35.00, quantity: 1, imageUrl: 'https://placehold.co/100x150/1a1a1a/c7a34f?text=Livro+3' }
];

const Carrinho = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(mockCartItems);

  // Função para remover um item do carrinho
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Função para ajustar a quantidade de um item
  const handleUpdateQuantity = (id, newQuantity) => {
    setCartItems(
      cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 } : item
      )
    );
  };

  // Calcula o total do carrinho
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Função para voltar à página anterior
  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(to bottom, #0A0A0A, #1A1A1A)',
          p: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={8}
            sx={{
              p: { xs: 4, md: 6 },
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
              border: '1px solid rgba(199, 163, 79, 0.3)',
              position: 'relative',
            }}
          >
            {/* Botão de voltar */}
            <Box
              onClick={handleGoBack}
              sx={{
                position: 'absolute',
                top: { xs: 16, md: 24 },
                left: { xs: 16, md: 24 },
                p: 1,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: '#C7A34F' }}
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Box>

            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                color: 'secondary.main',
                textShadow: '0 0 5px rgba(199, 163, 79, 0.5)',
                mb: 4
              }}
            >
              Seu Carrinho
            </Typography>

            {cartItems.length > 0 ? (
              <Box>
                {cartItems.map((item) => (
                  <Box key={item.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        py: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        textAlign: { xs: 'center', sm: 'left' },
                      }}
                    >
                      <Box
                        component="img"
                        src={item.imageUrl}
                        alt={item.name}
                        sx={{
                          width: 100,
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid rgba(199, 163, 79, 0.2)',
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 2, sm: 0 } }}>
                        <IconButton
                          aria-label="diminuir quantidade"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          sx={{ color: 'secondary.main', border: '1px solid', borderColor: 'rgba(199, 163, 79, 0.5)' }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ mx: 1 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          aria-label="aumentar quantidade"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          sx={{ color: 'secondary.main', border: '1px solid', borderColor: 'rgba(199, 163, 79, 0.5)' }}
                        >
                          <AddIcon />
                        </IconButton>
                        <IconButton
                          aria-label="remover item"
                          onClick={() => handleRemoveItem(item.id)}
                          sx={{ color: 'primary.main', ml: 2, '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2, borderColor: 'rgba(199, 163, 79, 0.1)' }} />
                  </Box>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Typography variant="h4" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    Subtotal: ${subtotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Finalizar Compra
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                  Seu carrinho está vazio.
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Carrinho;
