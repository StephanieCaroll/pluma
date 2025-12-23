import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Typography, Box, Button, Container, Paper, TextField, 
  CssBaseline, Fade, Alert, CircularProgress
} from '@mui/material';
import { supabase } from '../../services/supabaseClient';

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
  }
});

const ResetPassword = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const [error, setError] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
   
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento Auth:", event);
      
      if (event === "PASSWORD_RECOVERY") {
        setVerificandoSessao(false);
      } else {
       
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setVerificandoSessao(false);
        } else {
          
          setTimeout(() => {
            if (verificandoSessao) {
              setError("Sessão de recuperação não encontrada. Solicite um novo e-mail.");
              setVerificandoSessao(false);
            }
          }, 2000);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
    
      const { error } = await supabase.auth.updateUser({
        password: novaSenha
      });

      if (error) throw error;

      setSucesso(true);
      await supabase.auth.signOut();
      
      setTimeout(() => navigate('/form-login'), 3000);
    } catch (err) {
      setError(err.message === "Auth session missing!" 
        ? "Sessão expirada. Por favor, solicite um novo link de recuperação." 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  if (verificandoSessao) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0A0A0A' }}>
        <CircularProgress color="secondary" />
        <Typography sx={{ ml: 2, color: 'secondary.main' }}>Validando Chave...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0A0A0A' }}>
        <Fade in timeout={800}>
          <Container maxWidth="sm">
            <Paper elevation={8} sx={{ p: 4, textAlign: 'center', border: '1px solid #C7A34F', bgcolor: '#121212' }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', fontFamily: 'Cinzel' }}>
                Nova Senha
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.1)' }}>{error}</Alert>}
              {sucesso && <Alert severity="success" sx={{ mb: 2 }}>Sua chave foi alterada! Aguarde o redirecionamento...</Alert>}

              {!sucesso && !error && (
                <Box component="form" onSubmit={handleReset}>
                  <TextField
                    fullWidth
                    label="Nova Senha"
                    type="password"
                    required
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={loading}
                  />
                  <TextField
                    fullWidth
                    label="Confirmar Nova Senha"
                    type="password"
                    required
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    sx={{ mb: 3 }}
                    disabled={loading}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={loading}
                    sx={{ height: '50px' }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Imortalizar Nova Senha"}
                  </Button>
                </Box>
              )}
              
              {error && (
                <Button color="secondary" sx={{ mt: 2 }} onClick={() => navigate('/form-login')}>
                  Voltar ao Login
                </Button>
              )}
            </Paper>
          </Container>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default ResetPassword;