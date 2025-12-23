import React, { useState, useEffect, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Typography, Box, Button, Container, Grid, Card, CardMedia, CardContent,
  CssBaseline, Modal, Fade, IconButton, CircularProgress, InputBase, Divider,
  Snackbar, Alert, Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Inventory from '@mui/icons-material/Inventory';
import CalendarToday from '@mui/icons-material/CalendarToday';
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
  },
  typography: {
    fontFamily: '"Cinzel", serif',
    body1: { fontFamily: '"Crimson Text", serif' }
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
  zIndex: 1
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
  display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, outline: 'none', overflowY: 'auto'
};

const ListProduto = () => {
  const [open, setOpen] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [meusLivrosIds, setMeusLivrosIds] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const location = useLocation();
  const navigate = useNavigate();

  const categoriaFiltro = location.state?.categoria;

  const carregarDadosECompras = useCallback(async (termo = '') => {
    try {
      setCarregando(true);
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase.from('produtos').select('*');

      if (categoriaFiltro) {
        query = query.eq('genero', categoriaFiltro);
      }

      if (termo) {
        query = query.or(`titulo.ilike.%${termo}%,autor.ilike.%${termo}%`);
      }

      const { data: prodData, error: prodError } = await query;
      if (prodError) throw prodError;
      setProdutos(prodData || []);

      if (user) {
        const { data: favs } = await supabase.from('favoritos').select('produto_id').eq('usuario_id', user.id);
        setFavoritos(favs?.map(f => f.produto_id) || []);

        const { data: pedidosData } = await supabase
          .from('pedidos')
          .select('produtos_ids')
          .eq('usuario_id', user.id);
        
        if (pedidosData) {
          setMeusLivrosIds([...new Set(pedidosData.flatMap(p => p.produtos_ids))]);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setCarregando(false);
    }
  }, [categoriaFiltro]); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarDadosECompras(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, categoriaFiltro, carregarDadosECompras]);

  const handleToggleFavorito = async (e, id) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSnackbar({ open: true, message: 'Faça login para favoritar!', severity: 'error' }); return; }
    
    if (favoritos.includes(id)) {
      await supabase.from('favoritos').delete().eq('usuario_id', user.id).eq('produto_id', id);
      setFavoritos(prev => prev.filter(f => f !== id));
    } else {
      await supabase.from('favoritos').insert([{ usuario_id: user.id, produto_id: id }]);
      setFavoritos(prev => [...prev, id]);
    }
  };

  const handleAdicionarCarrinho = async (produto) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/form-login'); return; }
    try {
      const { error } = await supabase.from('carrinho').upsert({ 
        usuario_id: user.id, produto_id: produto.id, quantidade: 1 
      }, { onConflict: 'usuario_id, produto_id' });
      if (error) throw error;
      setSnackbar({ open: true, message: 'Adicionado ao carrinho!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao adicionar.', severity: 'error' });
    }
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
        <Container maxWidth="xl" sx={{ py: 8, flexGrow: 1 }}>
          <Typography variant="h2" align="center" sx={{ mb: 2, color: 'secondary.main', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Nossas Obras
          </Typography>
          
          {categoriaFiltro && (
            <Typography variant="h6" align="center" sx={{ mb: 4, color: 'secondary.light', fontStyle: 'italic' }}>
              Categoria: {categoriaFiltro}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Search sx={{ maxWidth: 600 }}>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase
                placeholder="Pesquise por manuscrito ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>
          </Box>

          {carregando && produtos.length === 0 ? (
            <Box display="flex" justifyContent="center" py={10}><CircularProgress color="secondary" /></Box>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {produtos.map((produto) => (
                <Grid item key={produto.id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card 
                    onClick={() => { setSelectedProduto(produto); setOpen(true); }}
                    sx={{ width: '300px', height: '580px', display: 'flex', flexDirection: 'column', cursor: 'pointer', bgcolor: '#121212', border: '1px solid rgba(199,163,79,0.2)', transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: '#C7A34F' } }}
                  >
                    <Box sx={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
                      <CardMedia component="img" image={produto.url_capa} sx={{ height: '100%', objectFit: 'cover' }} />
                      <IconButton 
                        onClick={(e) => handleToggleFavorito(e, produto.id)}
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: favoritos.includes(produto.id) ? '#ff1744' : '#FFFFFF' }}
                      >
                        {favoritos.includes(produto.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', p: 2 }}>
                      <Typography variant="h6" sx={{ color: 'secondary.main', height: '3.2rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mb: 1, fontSize: '1.1rem' }}>
                        {produto.titulo}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic', mb: 0.5 }}>{produto.autor}</Typography>
                      <Typography variant="caption" sx={{ color: 'secondary.light', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', mb: 2 }}>{produto.genero}</Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco || 0)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
          <Fade in={open}>
            <Box sx={modalStyle}>
              <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'secondary.main', zIndex: 10 }}><CloseIcon /></IconButton>
              {selectedProduto && (
                <>
                  <Box sx={{ flex: { xs: 'none', md: 1 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardMedia component="img" sx={{ maxHeight: { xs: '250px', md: '450px' }, width: 'auto', objectFit: 'contain', borderRadius: '4px' }} image={selectedProduto.url_capa} />
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" sx={{ color: 'secondary.main', fontFamily: 'Cinzel' }}>{selectedProduto.titulo}</Typography>
                    <Typography variant="h6" sx={{ fontStyle: 'italic', color: '#aaa' }}>{selectedProduto.autor}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography sx={{ mb: 2, color: '#ccc', fontSize: '0.95rem', textAlign: 'justify' }}>{selectedProduto.descricao}</Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}><Box display="flex" alignItems="center"><Inventory sx={{ mr: 1, color: 'secondary.main' }} fontSize="small"/><Typography variant="caption">{selectedProduto.genero}</Typography></Box></Grid>
                      <Grid item xs={6}><Box display="flex" alignItems="center"><CalendarToday sx={{ mr: 1, color: 'secondary.main' }} fontSize="small"/><Typography variant="caption">{selectedProduto.ano_publicacao}</Typography></Box></Grid>
                    </Grid>

                    {meusLivrosIds.includes(selectedProduto.id) ? (
                      <Button variant="contained" color="secondary" fullWidth sx={{ mt: 'auto', py: 1.5 }} onClick={() => setOpenPdf(true)} startIcon={<MenuBookIcon />}>
                        Ler Manuscrito
                      </Button>
                    ) : (
                      <Button variant="contained" color="secondary" fullWidth sx={{ mt: 'auto', py: 1.5 }} onClick={() => handleAdicionarCarrinho(selectedProduto)} startIcon={<ShoppingCartIcon />}>
                        Adicionar ao Carrinho
                      </Button>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>

        <Modal open={openPdf} onClose={() => setOpenPdf(false)}>
          <Box sx={{ position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%', bgcolor: '#000', border: '2px solid #C7A34F' }}>
            <Box sx={{ p: 1, bgcolor: '#C7A34F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'black', fontWeight: 'bold' }}>{selectedProduto?.titulo}</Typography>
              <IconButton onClick={() => setOpenPdf(false)}><CloseIcon sx={{ color: 'black' }} /></IconButton>
            </Box>
            <iframe src={selectedProduto?.url_arquivo_pdf} width="100%" height="95%" style={{ border: 'none' }} title="Leitor PDF"/>
          </Box>
        </Modal>

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
        <FooterComponent />
      </Box>
    </ThemeProvider>
  );
};

export default ListProduto;