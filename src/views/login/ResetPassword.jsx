import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Container, Paper, TextField, CssBaseline, Snackbar, Alert } from '@mui/material';
import { supabase } from '../../services/supabaseClient';
import { FooterComponent } from '../../MenuSistema';

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#280000' },
    secondary: { main: '#C7A34F' },
    background: { default: '#0A0A0A', paper: '#121212' },
    text: { primary: '#F0F0F0', secondary: '#C7A34F' }
  }
});

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSnackbar({ open: true, message: 'Senha atualizada com sucesso! Redirecionando...', severity: 'success' });
      setTimeout(() => navigate('/form-login'), 3000);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao atualizar: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
        <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Paper elevation={8} sx={{ p: 6, textAlign: 'center', width: '100%', border: '1px solid #C7A34F44' }}>
            <Typography variant="h4" sx={{ fontFamily: 'Cinzel', color: 'secondary.main', mb: 3 }}>
              Nova Senha
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
              Digite sua nova chave para o Santuário Pluma.
            </Typography>

            <Box component="form" onSubmit={handleReset}>
              <TextField
                fullWidth
                label="Nova Senha"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 4 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Atualizando...' : 'Confirmar Nova Senha'}
              </Button>
            </Box>
          </Paper>
        </Container>
        <FooterComponent />
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ResetPassword;