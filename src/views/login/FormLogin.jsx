import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Link,
  CssBaseline,
  Fade,
  Alert,
  CircularProgress
} from '@mui/material';

// IMPORTAÇÃO DO SUPABASE
import { supabase } from '../../services/supabaseClient';

import '@fontsource/monsieur-la-doulaise';
import '@fontsource/cinzel';
import '@fontsource/playfair-display';
import '@fontsource/crimson-text';

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#280000' },
    secondary: { main: '#C7A34F' },
    background: { default: '#0A0A0A', paper: '#121212' },
    text: { primary: '#F0F0F0', secondary: '#C7A34F' }
  },
  typography: {
    fontFamily: '"Cinzel", serif',
    h2: { fontSize: '2.5rem', fontWeight: 600 },
    body1: { fontFamily: '"Crimson Text", serif' }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(199, 163, 79, 0.5)' },
          '& .MuiInputLabel-root': { fontFamily: '"Cinzel", serif' }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }
      }
    }
  }
});

const FormLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fade, setFade] = useState(true);

  const navigate = useNavigate();

  // FUNÇÃO DE LOGIN REAL COM SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Tentativa de login no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // Se deu certo, inicia animação de saída e navega
      setFade(false);
      setTimeout(() => {
        navigate('/list-produto');
      }, 500);

    } catch (err) {
      // Tradução de erros comuns
      if (err.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/form-cadastro');
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
          p: 2
        }}
      >
        <Fade in={fade} timeout={500}>
          <Container maxWidth="sm">
            <Paper
              elevation={8}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: 'center',
                border: '1px solid rgba(199, 163, 79, 0.3)',
                bgcolor: 'rgba(18, 18, 18, 0.9)'
              }}
            >
              <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'secondary.main' }}>
                Entrar na Pluma
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', color: 'text.secondary' }}>
                Continue sua jornada literária.
              </Typography>

              {/* MENSAGEM DE ERRO SE O LOGIN FALHAR */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ff8a80' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 3, mb: 2, height: '50px' }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
                </Button>

                <Box sx={{ mt: 2 }}>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{ color: 'secondary.main', textDecoration: 'none' }}
                  >
                    Esqueceu a senha?
                  </Link>
                </Box>

                <Typography variant="body2" sx={{ mt: 3 }}>
                  Não tem uma conta?{' '}
                  <Link
                    onClick={handleRegisterClick}
                    sx={{ cursor: 'pointer', color: 'secondary.main', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    Cadastre-se
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

export default FormLogin;