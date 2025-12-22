import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Typography, Box, Button, Container, Grid, Card, CardMedia, CardContent,
  CssBaseline, Modal, Fade, IconButton, CircularProgress, InputBase, Divider,
  Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useLocation, useNavigate } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha('#C7A34F', 0.1),
  '&:hover': { backgroundColor: alpha('#C7A34F', 0.2) },
  width: '100%',
  border: `1px solid ${alpha('#C7A34F', 0.3)}`
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  color: '#C7A34F',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: '95%', maxWidth: 800, maxHeight: '90vh', bgcolor: '#121212',
  border: '2px solid #C7A34F', boxShadow: 24, p: { xs: 2, md: 4 },
  display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, overflowY: 'auto', outline: 'none'
};

const pdfModalStyle = {
  position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%',
  bgcolor: '#000', border: '2px solid #C7A34F', boxShadow: 24, outline: 'none',
  display: 'flex', flexDirection: 'column', zIndex: 3000
};

const ListProduto = () => {
  const [open, setOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [meusLivrosIds, setMeusLivrosIds] = useState([]);
  const [pdfAtivo, setPdfAtivo] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const location = useLocation();
  const navigate = useNavigate();
  const categoriaSelecionada = location.state?.categoria;

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase.from('produtos').select('*');
      if (categoriaSelecionada) query = query.eq('genero', categoriaSelecionada);
      if (searchTerm) query = query.or(`titulo.ilike.%${searchTerm}%,autor.ilike.%${searchTerm}%`);
      
      const { data: prodData } = await query;
      setProdutos(prodData || []);

      if (user) {
        const { data: favData } = await supabase.from('favoritos').select('produto_id').eq('usuario_id', user.id);
        setFavoritos(favData?.map(f => f.produto_id) || []);

        const { data: pedidosData } = await supabase.from('pedidos').select('produtos_ids').eq('usuario_id', user.id);
        if (pedidosData) {
          setMeusLivrosIds([...new Set(pedidosData.flatMap(p => p.produtos_ids))]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [categoriaSelecionada, searchTerm]);

  const handleComprar = async (e, produto) => {
    if (e) e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSnackbar({ open: true, message: 'Você precisa estar logado!', severity: 'error' });
      return;
    }
    try {
      await supabase.from('carrinho').upsert({ 
        usuario_id: user.id, produto_id: produto.id, quantidade: 1 
      }, { onConflict: 'usuario_id, produto_id' });
      setSnackbar({ open: true, message: `"${produto.titulo}" foi ao carrinho!`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao adicionar.', severity: 'error' });
    }
  };

  const toggleFavorito = async (e, id) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSnackbar({ open: true, message: 'Logue para favoritar!', severity: 'error' }); return; }
    
    if (favoritos.includes(id)) {
      await supabase.from('favoritos').delete().eq('usuario_id', user.id).eq('produto_id', id);
      setFavoritos(prev => prev.filter(f => f !== id));
    } else {
      await supabase.from('favoritos').insert([{ usuario_id: user.id, produto_id: id }]);
      setFavoritos(prev => [...prev, id]);
    }
  };

  const formatarPreco = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
        <Container maxWidth="xl" sx={{ py: 8, flexGrow: 1 }}>
          <Typography variant="h2" align="center" sx={{ mb: 6, color: 'secondary.main', fontFamily: 'Cinzel' }}>Nossas Obras</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Search component="form" onSubmit={(e) => e.preventDefault()} sx={{ maxWidth: 600 }}>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase
                placeholder="Pesquisar por título ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>
          </Box>

          {carregando ? (
            <Box display="flex" justifyContent="center"><CircularProgress color="secondary" /></Box>
          ) : (
           
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {produtos.map((produto) => (
                <Grid item key={produto.id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card 
                    onClick={() => { setSelectedProduto(produto); setOpen(true); }}
                    sx={{ 
                      width: '100%',
                      maxWidth: '320px', 
                      height: '580px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      borderRadius: 0,
                      border: '1px solid rgba(199, 163, 79, 0.2)', 
                      backgroundColor: '#121212',
                      cursor: 'pointer', 
                      position: 'relative', 
                      transition: '0.3s',
                      '&:hover': { transform: 'translateY(-8px)', borderColor: '#C7A34F' }
                    }}
                  >
                    <IconButton 
                      onClick={(e) => toggleFavorito(e, produto.id)}
                      sx={{ 
                        position: 'absolute', top: 10, right: 10, zIndex: 5,
                        color: favoritos.includes(produto.id) ? '#ff1744' : 'rgba(255,255,255,0.7)',
                        bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }
                      }}
                    >
                      {favoritos.includes(produto.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>

                    <Box sx={{ height: '340px', width: '100%', overflow: 'hidden', flexShrink: 0 }}>
                      <CardMedia 
                        component="img" 
                        sx={{ height: '100%', width: '100%', objectFit: 'cover' }} 
                        image={produto.url_capa} 
                      />
                    </Box>

                    <CardContent sx={{ 
                      flexGrow: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between', 
                      textAlign: 'center', 
                      p: 2 
                    }}>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontFamily: 'Cinzel', 
                          color: 'secondary.main', 
                          fontSize: '1rem', 
                          fontWeight: 'bold',
                          height: '2.5rem',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {produto.titulo}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', mb: 1 }}>
                          {produto.autor}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: '#C7A34F', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                          {produto.genero}
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#F0F0F0', fontWeight: 'bold', mb: 1.5 }}>
                          {formatarPreco(produto.preco)}
                        </Typography>
                        <Button 
                          fullWidth variant="contained" color="secondary"
                          startIcon={<ShoppingCartIcon />}
                          onClick={(e) => handleComprar(e, produto)}
                          sx={{ borderRadius: 0, fontWeight: 'bold' }}
                        >
                          Comprar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Fade in={open}>
            <Box sx={modalStyle}>
              <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: '#C7A34F', zIndex: 10 }}><CloseIcon /></IconButton>
              {selectedProduto && (
                <>
                  <CardMedia component="img" sx={{ width: { xs: '100%', md: 280 }, height: { xs: 350, md: 450 }, objectFit: 'cover' }} image={selectedProduto.url_capa} />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" sx={{ color: '#C7A34F', fontFamily: 'Cinzel', mb: 1 }}>{selectedProduto.titulo}</Typography>
                    <Typography variant="h6" sx={{ mb: 1, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>{selectedProduto.autor}</Typography>
                    <Divider sx={{ mb: 2, bgcolor: 'rgba(199, 163, 79, 0.3)' }} />
                    <Typography sx={{ mb: 4, fontFamily: 'Crimson Text', color: '#EEE' }}>{selectedProduto.descricao}</Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                      {meusLivrosIds.includes(selectedProduto.id) ? (
                        <Button fullWidth variant="contained" color="success" startIcon={<MenuBookIcon />} onClick={() => setPdfAtivo(selectedProduto.url_arquivo_pdf)} sx={{ py: 1.5, fontWeight: 'bold', bgcolor: '#2e7d32' }}>Ler Manuscrito</Button>
                      ) : (
                        <Button fullWidth variant="contained" color="secondary" startIcon={<ShoppingCartIcon />} onClick={(e) => handleComprar(e, selectedProduto)} sx={{ py: 1.5, fontWeight: 'bold' }}>Adicionar ao Carrinho</Button>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>

        <Modal open={!!pdfAtivo} onClose={() => setPdfAtivo(null)}>
          <Box sx={pdfModalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#C7A34F' }}>
              <Typography sx={{ color: '#000', fontWeight: 'bold', ml: 2 }}>Leitura Pluma</Typography>
              <IconButton onClick={() => setPdfAtivo(null)} sx={{ color: '#000' }}><CloseIcon /></IconButton>
            </Box>
            <iframe src={pdfAtivo} width="100%" height="100%" style={{ border: 'none' }} title="Leitor" />
          </Box>
        </Modal>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} variant="filled" sx={{ bgcolor: snackbar.severity === 'success' ? '#C7A34F' : '#280000', color: 'white' }}>{snackbar.message}</Alert>
        </Snackbar>

        <FooterComponent />
      </Box>
    </ThemeProvider>
  );
};

export default ListProduto;