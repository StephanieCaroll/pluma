import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Grid, Card, CardMedia, CircularProgress, 
  Button, CssBaseline, IconButton, Snackbar, Alert, Modal, Fade, Divider 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { supabase } from '../../services/supabaseClient';
import { FooterComponent } from '../../MenuSistema';

import '@fontsource/cinzel';
import '@fontsource/crimson-text';

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#280000' },
    secondary: { main: '#C7A34F' },
    background: { default: '#0A0A0A', paper: '#121212' },
    text: { primary: '#F0F0F0', secondary: '#C7A34F' }
  }
});

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: '95%', maxWidth: 800, maxHeight: '90vh', bgcolor: '#121212',
  border: '2px solid #C7A34F', boxShadow: 24, p: { xs: 2, md: 4 },
  display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, overflowY: 'auto', outline: 'none',
  borderRadius: '8px'
};

const pdfModalStyle = {
  position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%',
  bgcolor: '#000', border: '2px solid #C7A34F', boxShadow: 24, outline: 'none',
  display: 'flex', flexDirection: 'column', zIndex: 3000
};

const Favoritos = () => {
  const [favAgrupados, setFavAgrupados] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [meusLivrosIds, setMeusLivrosIds] = useState([]);
  const [pdfAtivo, setPdfAtivo] = useState(null);
  const navigate = useNavigate();

  const carregarFavoritosECompras = async () => {
    try {
      const { data: { user: userLogado } } = await supabase.auth.getUser();
      if (!userLogado) { navigate('/form-login'); return; }

      const { data: favData } = await supabase
        .from('favoritos')
        .select('id, produtos(id, titulo, genero, url_capa, autor, descricao, preco, url_arquivo_pdf)')
        .eq('usuario_id', userLogado.id);

      const { data: pedidosData } = await supabase
        .from('pedidos')
        .select('produtos_ids')
        .eq('usuario_id', userLogado.id);
      
      if (pedidosData) {
        setMeusLivrosIds([...new Set(pedidosData.flatMap(p => p.produtos_ids))]);
      }

      const agrupados = favData?.reduce((acc, item) => {
        if (item.produtos) {
          const genero = item.produtos.genero || 'Outros';
          if (!acc[genero]) acc[genero] = [];
          acc[genero].push({ ...item.produtos, fav_id: item.id });
        }
        return acc;
      }, {}) || {};

      setFavAgrupados(agrupados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarFavoritosECompras(); }, [navigate]);

  const handleRemoverFavorito = async (e, favId, titulo) => {
    e.stopPropagation();
    const { error } = await supabase.from('favoritos').delete().eq('id', favId);
    if (!error) {
      setSnackbar({ open: true, message: `"${titulo}" removido!`, severity: 'success' });
      carregarFavoritosECompras();
    }
  };

  const handleAdicionarAoCarrinho = async (produto) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/form-login'); return; }

    try {
      const { error } = await supabase
        .from('carrinho')
        .upsert({ 
          usuario_id: user.id, 
          produto_id: produto.id, 
          quantidade: 1 
        }, { onConflict: 'usuario_id, produto_id' });

      if (error) throw error;

      setSnackbar({ 
        open: true, 
        message: `"${produto.titulo}" foi adicionado ao seu carrinho!`, 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao adicionar ao carrinho.', severity: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, bgcolor: '#000', minHeight: '100vh' }}><CircularProgress color="secondary" /></Box>;

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
        <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
          <Typography variant="h3" align="center" sx={{ mb: 6, color: 'secondary.main', fontFamily: 'Cinzel' }}>Meus Favoritos</Typography>
          
          {Object.keys(favAgrupados).length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h6" sx={{ color: 'gray', fontStyle: 'italic' }}>Sua estante de favoritos está vazia.</Typography>
                <Button variant="outlined" color="secondary" sx={{ mt: 3 }} onClick={() => navigate('/list-produto')}>Explorar Manuscritos</Button>
            </Box>
          ) : (
            Object.keys(favAgrupados).map(genero => (
              <Box key={genero} sx={{ mb: 8 }}>
                <Typography variant="h5" sx={{ color: 'secondary.main', mb: 4, borderBottom: '1px solid rgba(199, 163, 79, 0.2)', pb: 1, fontFamily: 'Cinzel' }}>
                  {genero}
                </Typography>
                <Grid container spacing={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                  {favAgrupados[genero].map(livro => (
                    <Grid item key={livro.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Card 
                        onClick={() => { setSelectedProduto(livro); setOpenModal(true); }} 
                        sx={{ 
                          width: '200px', 
                          height: '380px', 
                          bgcolor: '#121212', 
                          cursor: 'pointer', 
                          position: 'relative',
                          border: '1px solid rgba(199, 163, 79, 0.2)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '0.3s',
                          '&:hover': { transform: 'translateY(-5px)', borderColor: 'secondary.main' }
                        }}
                      >
                        <IconButton 
                          onClick={(e) => handleRemoverFavorito(e, livro.fav_id, livro.titulo)} 
                          sx={{ position: 'absolute', top: 5, right: 5, color: '#ff4444', zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        
                        <Box sx={{ height: '280px', overflow: 'hidden' }}>
                            <CardMedia component="img" image={livro.url_capa} sx={{ height: '100%', objectFit: 'cover' }} />
                        </Box>

                        <Box sx={{ p: 1.5, textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                color: 'secondary.main', 
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: '1.2em'
                            }}
                          >
                            {livro.titulo}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          )}
        </Container>

        {/* MODAL DE DETALHES */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Fade in={openModal}>
            <Box sx={modalStyle}>
              <IconButton onClick={() => setOpenModal(false)} sx={{ position: 'absolute', right: 8, top: 8, color: '#C7A34F' }}><CloseIcon /></IconButton>
              {selectedProduto && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CardMedia component="img" sx={{ width: { xs: '100%', md: 280 }, maxHeight: 450, objectFit: 'contain', borderRadius: '4px' }} image={selectedProduto.url_capa} />
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" sx={{ color: 'secondary.main', fontFamily: 'Cinzel' }}>{selectedProduto.titulo}</Typography>
                    <Typography variant="h6" sx={{ fontStyle: 'italic', color: 'gray', mb: 1 }}>{selectedProduto.autor}</Typography>
                    <Divider sx={{ my: 1, bgcolor: 'rgba(199, 163, 79, 0.1)' }} />
                    <Typography variant="body1" sx={{ my: 2, textAlign: 'justify', color: '#ccc' }}>{selectedProduto.descricao}</Typography>
                    
                    <Box sx={{ mt: 'auto' }}>
                        {meusLivrosIds.includes(selectedProduto.id) ? (
                        <Button 
                            fullWidth variant="contained" color="secondary" 
                            startIcon={<MenuBookIcon />} 
                            onClick={() => setPdfAtivo(selectedProduto.url_arquivo_pdf)}
                            sx={{ py: 1.5 }}
                        >
                            Ler Manuscrito
                        </Button>
                        ) : (
                        <Button 
                            fullWidth variant="contained" color="secondary" 
                            startIcon={<ShoppingCartIcon />} 
                            onClick={() => handleAdicionarAoCarrinho(selectedProduto)}
                            sx={{ py: 1.5 }}
                        >
                            Adicionar ao Carrinho
                        </Button>
                        )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>

        {/* LEITOR DE PDF */}
        <Modal open={!!pdfAtivo} onClose={() => setPdfAtivo(null)}>
          <Box sx={pdfModalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#C7A34F' }}>
                <Typography sx={{ color: '#000', fontWeight: 'bold', ml: 2 }}>{selectedProduto?.titulo}</Typography>
                <IconButton onClick={() => setPdfAtivo(null)} sx={{ color: '#000' }}><CloseIcon /></IconButton>
            </Box>
            <iframe src={pdfAtivo} width="100%" height="100%" title="Leitor" style={{ border: 'none' }} />
          </Box>
        </Modal>

        <FooterComponent />

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%', border: '1px solid #C7A34F' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Favoritos;