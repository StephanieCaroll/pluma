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
  Modal,
  Backdrop,
  Snackbar,
  Alert
} from '@mui/material';

import '@fontsource/monsieur-la-doulaise';
import '@fontsource/cinzel';
import '@fontsource/playfair-display';
import '@fontsource/crimson-text';

import { FooterComponent } from '../../MenuSistema';
import { supabase } from '../../services/supabaseClient';

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
    h1: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '0.1em' },
    h2: { fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.05em' },
    h4: { color: '#C7A34F', fontWeight: 500, letterSpacing: '0.05em' },
    h5: { fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.03em' },
    body1: { fontFamily: '"Crimson Text", serif', fontSize: '1.1rem', lineHeight: 1.6 }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': { margin: 0, padding: 0, height: '100%', width: '100%' },
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
          '&:hover': { transform: 'translateY(-2px)' }
        },
        containedSecondary: {
          color: '#0A0A0A',
          '&:hover': { backgroundColor: '#E8C87E' }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': { borderRadius: 0, color: '#F0F0F0', fontFamily: '"Crimson Text", serif' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(199, 163, 79, 0.5)', transition: 'border-color 0.3s ease' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E8C87E !important' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C7A34F !important', borderWidth: '2px !important' },
          '& .MuiInputLabel-root': { color: 'rgba(240, 240, 240, 0.7)', fontFamily: '"Cinzel", serif' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#C7A34F' }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(18, 18, 18, 0.95)', border: '1px solid rgba(199, 163, 79, 0.2)', backdropFilter: 'blur(10px)' }
      }
    }
  }
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: '#121212',
  border: '2px solid #C7A34F',
  boxShadow: '0 0 20px rgba(199, 163, 79, 0.2)',
  p: 4,
  textAlign: 'center',
  outline: 'none'
};

const FormLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fade, setFade] = useState(true);
  
  const [openForgot, setOpenForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [loadingReset, setLoadingReset] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setSnackbar({ open: true, message: 'Erro no login: ' + error.message, severity: 'error' });
      } else if (data.user) {
        setFade(false);
        setTimeout(() => navigate('/perfil'), 300);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoadingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSnackbar({ 
        open: true, 
        message: 'O corvo mensageiro foi enviado ao seu e-mail!', 
        severity: 'success' 
      });
      setOpenForgot(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro: ' + error.message, severity: 'error' });
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom, #0A0A0A, #1A1A1A)', position: 'relative', overflow: 'hidden' }}>
        <Fade in={fade} timeout={500}>
          <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 4 }}>
            <Paper elevation={8} sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', width: '100%' }}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'secondary.main', textShadow: '0 0 5px rgba(199, 163, 79, 0.5)' }}>
                Entrar na Pluma
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', color: 'text.secondary' }}>
                Continue sua jornada literária.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField margin="normal" required fullWidth label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                <TextField margin="normal" required fullWidth label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2 }}>
                  Entrar
                </Button>
                
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link
                    onClick={() => setOpenForgot(true)}
                    sx={{ cursor: 'pointer', color: 'secondary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, fontSize: '0.875rem' }}
                  >
                    Esqueceu a senha?
                  </Link>
                  <Typography variant="body2">
                    Não tem uma conta?{' '}
                    <Link onClick={() => navigate('/form-cadastro')} sx={{ cursor: 'pointer', color: 'secondary.main', textDecoration: 'none', fontWeight: 'bold' }}>
                      Cadastre-se
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Fade>
        <FooterComponent />

        {/* MODAL DE ESQUECEU A SENHA */}
        <Modal
          open={openForgot}
          onClose={() => setOpenForgot(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500, sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } } }}
        >
          <Fade in={openForgot}>
            <Box sx={modalStyle}>
              <Typography variant="h4" sx={{ color: 'secondary.main', mb: 2 }}>Recuperar Acesso</Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Informe seu e-mail para enviarmos as chaves de redefinição.
              </Typography>
              <Box component="form" onSubmit={handleForgotPassword}>
                <TextField
                  fullWidth
                  required
                  label="Seu E-mail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="secondary" 
                  type="submit"
                  disabled={loadingReset}
                >
                  {loadingReset ? 'Enviando...' : 'Enviar Link'}
                </Button>
                <Button 
                  fullWidth 
                  variant="text" 
                  onClick={() => setOpenForgot(false)} 
                  sx={{ mt: 1, color: 'text.secondary', textTransform: 'none' }}
                >
                  Voltar
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default FormLogin;