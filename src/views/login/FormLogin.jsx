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
  CircularProgress,
  Modal,
  Backdrop,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: '#121212',
  border: '2px solid #C7A34F',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
  outline: 'none'
};

const FormLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fade, setFade] = useState(true);

  // Estados para o Modal de Esqueci Senha
  const [openForgot, setOpenForgot] = useState(false);
  const [emailForgot, setEmailForgot] = useState('');
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [msgForgot, setMsgForgot] = useState({ text: '', type: 'success' });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setFade(false);
      setTimeout(() => navigate('/list-produto'), 500);
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoadingForgot(true);
    setMsgForgot({ text: '', type: 'success' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailForgot, {
       redirectTo: 'https://pluma-smoky.vercel.app/reset-password'
      });

      if (error) throw error;

      setMsgForgot({ 
        text: 'Enviamos um pergaminho (e-mail) com as instruções de recuperação.', 
        type: 'success' 
      });
    } catch (err) {
      setMsgForgot({ text: 'Erro ao solicitar recuperação: ' + err.message, type: 'error' });
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: 'linear-gradient(to bottom, #0A0A0A, #1A1A1A)', p: 2 }}>
        <Fade in={fade} timeout={500}>
          <Container maxWidth="sm">
            <Paper elevation={8} sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', border: '1px solid rgba(199, 163, 79, 0.3)', bgcolor: 'rgba(18, 18, 18, 0.9)' }}>
              <Typography variant="h2" gutterBottom sx={{ color: 'secondary.main' }}>Entrar na Pluma</Typography>
              <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', color: 'text.secondary' }}>Continue sua jornada literária.</Typography>

              {error && <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ff8a80' }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField margin="normal" required fullWidth label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                <TextField margin="normal" required fullWidth label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />

                <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2, height: '50px' }} disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
                </Button>

                <Box sx={{ mt: 2 }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => setOpenForgot(true)}
                    sx={{ color: 'secondary.main', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    Esqueceu a senha?
                  </Link>
                </Box>

                <Typography variant="body2" sx={{ mt: 3 }}>
                  Não tem uma conta?{' '}
                  <Link onClick={() => navigate('/form-cadastro')} sx={{ cursor: 'pointer', color: 'secondary.main', textDecoration: 'none', fontWeight: 'bold' }}>Cadastre-se</Link>
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Fade>
      </Box>

      <Modal
        open={openForgot}
        onClose={() => setOpenForgot(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={openForgot}>
          <Box sx={modalStyle}>
            <IconButton 
              onClick={() => setOpenForgot(false)} 
              sx={{ position: 'absolute', right: 8, top: 8, color: 'secondary.main' }}
            >
              <CloseIcon />
            </IconButton>
            
            <Typography variant="h5" sx={{ color: 'secondary.main', mb: 2, fontFamily: 'Cinzel' }}>
              Recuperar Acesso
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Informe seu e-mail para receber as instruções de renovação.
            </Typography>

            {msgForgot.text && (
              <Alert severity={msgForgot.type} sx={{ mb: 2, fontSize: '0.8rem' }}>
                {msgForgot.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleForgotSubmit}>
              <TextField 
                fullWidth 
                label="E-mail de cadastro" 
                required 
                value={emailForgot}
                onChange={(e) => setEmailForgot(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button 
                fullWidth 
                variant="contained" 
                color="secondary" 
                type="submit"
                disabled={loadingForgot}
              >
                {loadingForgot ? <CircularProgress size={24} color="inherit" /> : 'Enviar Instruções'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default FormLogin;