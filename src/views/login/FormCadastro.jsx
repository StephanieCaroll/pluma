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
  Fade,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';

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
    }
  }
});

const FormCadastro = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fade, setFade] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem!');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
     
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            full_name: nome, 
          },
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(true);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/form-login');
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
            
              <IconButton 
                onClick={handleGoBack}
                sx={{ position: 'absolute', top: 16, left: 16, color: 'secondary.main' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </IconButton>

              <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'secondary.main' }}>
                Criar uma Conta
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', color: 'text.secondary' }}>
                Junte-se à nossa comunidade literária.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              {success ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Cadastro realizado com sucesso!
                  </Alert>
                  <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
                    Enviamos um link de confirmação para o seu e-mail: <strong>{email}</strong>. 
                    Por favor, verifique sua caixa de entrada para ativar sua conta.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => navigate('/form-login')}
                  >
                    Ir para o Login
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Nome Completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={loading}
                  />
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
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirme a Senha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
                  </Button>

                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Já tem uma conta?{' '}
                    <Link
                      onClick={() => navigate('/form-login')}
                      sx={{ cursor: 'pointer', color: 'secondary.main', textDecoration: 'none' }}
                    >
                      Entrar
                    </Link>
                  </Typography>
                </Box>
              )}
            </Paper>
          </Container>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default FormCadastro;