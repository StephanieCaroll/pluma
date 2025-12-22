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
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { supabase } from '../../services/supabaseClient';
import '@fontsource/monsieur-la-doulaise';
import '@fontsource/cinzel';
import '@fontsource/playfair-display';
import '@fontsource/crimson-text';
import { FooterComponent } from '../../MenuSistema';

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
    h2: { fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.05em' },
    body1: { fontFamily: '"Crimson Text", serif', fontSize: '1.1rem', lineHeight: 1.6 }
  }
});

const FormCadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = name === 'username' ? value.replace(/\s/g, '').toLowerCase() : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Nome de usuário é obrigatório';
    if (formData.username.length < 3) newErrors.username = 'Mínimo de 3 caracteres';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (formData.senha.length < 6) newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
    if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'As senhas não coincidem';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);

  try {
    
    const { data: checkData, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', formData.username.toLowerCase());

    if (checkError) throw checkError;
    if (checkData && checkData.length > 0) {
      throw new Error('Este nome de usuário já está em uso.');
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.senha,
      options: {
        data: { username: formData.username }
      }
    });

    if (authError) throw authError;

    if (authData?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            username: formData.username.toLowerCase(), 
            email: formData.email 
          }
        ]);

      if (profileError) {
        console.warn("Perfil não criado via código. Se a confirmação de e-mail estiver ON, isso é normal.");
      }
    }

    setSnackbar({
      open: true,
      message: 'Cadastro realizado! Verifique seu e-mail para confirmar.',
      severity: 'success'
    });

  } catch (error) {
    setSnackbar({ open: true, message: error.message, severity: 'error' });
  } finally {
    setLoading(false);
  }
};

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <Fade in={true} timeout={800}>
            <Container maxWidth="sm">
              <Paper elevation={8} sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', border: '1px solid rgba(199, 163, 79, 0.3)', bgcolor: '#121212' }}>
                <Typography variant="h2" gutterBottom sx={{ color: 'secondary.main', fontFamily: 'Cinzel' }}>Registro</Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                  <TextField
                    margin="normal" required fullWidth 
                    label="Nome de Usuário (único)" 
                    name="username"
                    value={formData.username} 
                    onChange={handleChange} 
                    error={!!errors.username} 
                    helperText={errors.username || "Não use espaços"}
                  />
                  <TextField
                    margin="normal" required fullWidth 
                    label="E-mail" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    error={!!errors.email} 
                    helperText={errors.email}
                  />
                  <TextField
                    margin="normal" required fullWidth 
                    label="Senha" 
                    name="senha" 
                    type="password"
                    value={formData.senha} 
                    onChange={handleChange} 
                    error={!!errors.senha} 
                    helperText={errors.senha}
                  />
                  <TextField
                    margin="normal" required fullWidth 
                    label="Confirme a Senha" 
                    name="confirmarSenha" 
                    type="password"
                    value={formData.confirmarSenha} 
                    onChange={handleChange} 
                    error={!!errors.confirmarSenha} 
                    helperText={errors.confirmarSenha}
                  />

                  <Button 
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    color="secondary" 
                    sx={{ mt: 4, mb: 2, height: '50px', fontWeight: 'bold' }} 
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
                  </Button>
                  
                  <Link href="#" onClick={() => navigate('/form-login')} sx={{ color: 'secondary.main', textDecoration: 'none', display: 'block', mt: 2 }}>
                    Já tenho uma conta
                  </Link>
                </Box>
              </Paper>
            </Container>
          </Fade>
        </Box>
        <FooterComponent />
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default FormCadastro;