import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Grid,
  CssBaseline,
  Fade,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment
} from '@mui/material';
import { 
  AutoStories, 
  HistoryEdu, 
  Category, 
  Language, 
  MenuBook, 
  Event, 
  Image as ImageIcon, 
  PictureAsPdf,
  Create
} from '@mui/icons-material';
import { supabase } from '../../services/supabaseClient';
import { FooterComponent } from '../../MenuSistema';

import '@fontsource/cinzel';
import '@fontsource/crimson-text';

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#280000' },
    secondary: { main: '#C7A34F', light: '#E8C87E', dark: '#A3873A' },
    background: { default: '#0A0A0A', paper: '#121212' },
    text: { primary: '#F0F0F0', secondary: '#C7A34F' }
  },
  typography: {
    fontFamily: '"Crimson Text", serif',
    h2: { 
      fontFamily: '"Cinzel", serif',
      fontSize: '2.8rem', 
      fontWeight: 700, 
      letterSpacing: '0.15em',
      textTransform: 'uppercase'
    }
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    '& fieldset': { borderColor: 'rgba(199, 163, 79, 0.3)' },
    '&:hover fieldset': { borderColor: '#E8C87E' },
    '&.Mui-focused fieldset': { borderColor: '#C7A34F' },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Cinzel", serif',
    color: 'rgba(240, 240, 240, 0.5)',
  },
});

const FormProduto = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [produto, setProduto] = useState({
    titulo: '', autor: '', descricao: '', genero: '',
    idioma: 'Português', numero_paginas: '', ano_publicacao: '',
    url_capa: '', url_arquivo_pdf: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('produtos').insert([{
        ...produto,
        numero_paginas: parseInt(produto.numero_paginas) || 0,
        ano_publicacao: parseInt(produto.ano_publicacao) || 0
      }]);
      if (error) throw error;
      setSnackbar({ open: true, message: 'Obra imortalizada com sucesso!', severity: 'success' });
      setProduto({ titulo: '', autor: '', descricao: '', genero: '', idioma: 'Português', numero_paginas: '', ano_publicacao: '', url_capa: '', url_arquivo_pdf: '' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro: ' + error.message, severity: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundImage: 'radial-gradient(circle at center, #1A1A1A 0%, #0A0A0A 100%)',
      }}>
        <Container maxWidth="md" sx={{ py: 10, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Fade in timeout={1000}>
            <Paper elevation={24} sx={{ 
              p: { xs: 4, md: 8 }, 
              width: '100%', 
              backgroundColor: 'rgba(18, 18, 18, 0.95)',
              border: '1px solid rgba(199, 163, 79, 0.2)',
              textAlign: 'center'
            }}>
              <Box sx={{ mb: 6 }}>
                <HistoryEdu sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h2" sx={{ color: 'secondary.main', mb: 2 }}>Nova Obra</Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'rgba(240, 240, 240, 0.7)', fontSize: '1.2rem', mb: 2 }}>
                  "Escrever é a arte de imortalizar a alma em pergaminho."
                </Typography>
                <Divider sx={{ width: '60px', height: '2px', bgcolor: 'secondary.main', mx: 'auto' }} />
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={4} justifyContent="center">
                  
                  <Grid item xs={12} md={6}>
                    <StyledTextField fullWidth label="Título" name="titulo" value={produto.titulo} onChange={handleChange} required 
                      InputProps={{ startAdornment: (<InputAdornment position="start"><AutoStories sx={{ color: 'secondary.dark' }} /></InputAdornment>) }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField fullWidth label="Autor" name="autor" value={produto.autor} onChange={handleChange} required 
                      InputProps={{ startAdornment: (<InputAdornment position="start"><HistoryEdu sx={{ color: 'secondary.dark' }} /></InputAdornment>) }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField fullWidth label="Gênero" name="genero" value={produto.genero} onChange={handleChange} 
                      InputProps={{ startAdornment: (<InputAdornment position="start"><Category sx={{ color: 'secondary.dark' }} /></InputAdornment>) }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField fullWidth label="Páginas" name="numero_paginas" type="number" value={produto.numero_paginas} onChange={handleChange} 
                      InputProps={{ startAdornment: (<InputAdornment position="start"><MenuBook sx={{ color: 'secondary.dark' }} /></InputAdornment>) }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField fullWidth label="Ano" name="ano_publicacao" type="number" value={produto.ano_publicacao} onChange={handleChange} 
                      InputProps={{ startAdornment: (<InputAdornment position="start"><Event sx={{ color: 'secondary.dark' }} /></InputAdornment>) }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField fullWidth label="Idioma" name="idioma" value={produto.idioma} onChange={handleChange} 
                      InputProps={{ startAdornment: (<InputAdornment position="start"><Language sx={{ color: 'secondary.dark' }} /></InputAdornment>) }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <StyledTextField fullWidth label="URL da Capa" name="url_capa" value={produto.url_capa} onChange={handleChange} 
                      InputProps={{ startAdornment: (<InputAdornment position="start"><ImageIcon sx={{ color: 'secondary.dark' }} /></InputAdornment>) }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField fullWidth label="URL do PDF" name="url_arquivo_pdf" value={produto.url_arquivo_pdf} onChange={handleChange} 
                      InputProps={{ startAdornment: (<InputAdornment position="start"><PictureAsPdf sx={{ color: 'secondary.dark' }} /></InputAdornment>) }} />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField fullWidth label="Sinopse" name="descricao" multiline rows={5} value={produto.descricao} onChange={handleChange}
                      InputProps={{ startAdornment: (<InputAdornment position="start" sx={{ alignSelf: 'flex-start',marginTop: '12px',marginRight: '8px'}}
                          >
                            <Create sx={{ color: 'secondary.dark', fontSize: 20 }} />
                          </InputAdornment>
                        ) 
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          paddingLeft: '14px' 
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
                      <Button fullWidth variant="contained" color="secondary" type="submit" disabled={loading} sx={{ py: 1.5 }}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Imortalizar Obra'}
                      </Button>
                      <Button fullWidth variant="outlined" color="secondary" onClick={() => navigate('/list-produto')} sx={{ py: 1.5 }}>
                        Voltar
                      </Button>
                    </Box>
                  </Grid>

                </Grid>
              </Box>
            </Paper>
          </Fade>
        </Container>
        <FooterComponent />
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%', border: '1px solid #C7A34F' }}>{snackbar.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default FormProduto;