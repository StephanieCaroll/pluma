import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Link,
  CssBaseline,
  Fade
} from '@mui/material';

import '@fontsource/monsieur-la-doulaise';
import '@fontsource/cinzel';
import '@fontsource/playfair-display';
import '@fontsource/crimson-text';

// O tema foi replicado aqui para que o componente seja autossuficiente e funcione corretamente.
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            borderRadius: 0,
            color: '#F0F0F0',
            fontFamily: '"Crimson Text", serif'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(199, 163, 79, 0.5)',
            transition: 'border-color 0.3s ease'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E8C87E !important',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C7A34F !important',
            borderWidth: '2px !important'
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(240, 240, 240, 0.7)',
            fontFamily: '"Cinzel", serif'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#C7A34F',
          },
          '& .MuiInputBase-input': {
            padding: '16.5px 14px'
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

const FormCadastro = () => {
  // Hook para navegação
  const navigate = useNavigate();

  // Estados para gerenciar os dados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [fade, setFade] = useState(true);

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
        console.error('As senhas não coincidem!');
        // Aqui você pode adicionar um feedback visual para o usuário
        return;
    }
    setFade(false); // Inicia a animação de saída
    // Simula um atraso antes de cadastrar para a animação
    setTimeout(() => {
        console.log('Dados de cadastro:', { nome, email, senha });
        // Aqui você faria a chamada para a sua API de registro
        setFade(true); // Retorna a animação de entrada
        // Lógica de redirecionamento ou de feedback ao usuário
    }, 500);
  };
  
  // Função para voltar à página anterior
  const handleGoBack = () => {
    navigate('/');
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
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 80% 70%, rgba(199, 163, 79, 0.05) 0%, transparent 20%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Fade in={fade} timeout={500}>
          <Container maxWidth="sm">
            <Paper
              elevation={8}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: 'center',
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
                sx={{
                  color: 'secondary.main',
                  textShadow: '0 0 5px rgba(199, 163, 79, 0.5)'
                }}
              >
                Criar uma Conta
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontStyle: 'italic',
                  color: 'text.secondary'
                }}
              >
                Junte-se à nossa comunidade literária.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nome"
                  label="Nome Completo"
                  name="nome"
                  autoComplete="nome"
                  autoFocus
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirme a Senha"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Cadastrar
                </Button>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Já tem uma conta?{' '}
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      color: 'secondary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Entrar
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default FormCadastro;
