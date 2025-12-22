import React, { useState, useEffect } from 'react';
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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Inventory from '@mui/icons-material/Inventory';
import Language from '@mui/icons-material/Language';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { useLocation, useNavigate } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';

// Importação do Cliente Supabase
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

// ESTILO DO MODAL ATUALIZADO PARA RESPONSIVIDADE
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 800,
  maxHeight: '90vh', // Não deixa o modal vazar a altura da tela
  bgcolor: 'background.paper',
  border: '2px solid #C7A34F',
  boxShadow: 24,
  p: { xs: 2, md: 4 }, // Padding menor no celular
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' }, // Empilha no celular, lado a lado no PC
  gap: 3,
  outline: 'none',
  overflowY: 'auto', // Ativa rolagem se o conteúdo for grande
  borderRadius: '8px'
};

const ListProduto = () => {
  const [open, setOpen] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const location = useLocation();
  const navigate = useNavigate();

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get('search') || '';
      setSearchTerm(search);

      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase.from('produtos').select('*');
      
      if (search) {
        query = query.or(`titulo.ilike.%${search}%,autor.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setProdutos(data || []);

      if (user) {
        const { data: favs } = await supabase.from('favoritos').select('produto_id').eq('usuario_id', user.id);
        setFavoritos(favs?.map(f => f.produto_id) || []);
      }
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [location.search]);

  const handleToggleFavorito = async (e, id) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSnackbar({ open: true, message: 'Logue para favoritar!', severity: 'error' });
      return;
    }

    if (favoritos.includes(id)) {
      await supabase.from('favoritos').delete().eq('usuario_id', user.id).eq('produto_id', id);
      setFavoritos(prev => prev.filter(f => f !== id));
    } else {
      await supabase.from('favoritos').insert([{ usuario_id: user.id, produto_id: id }]);
      setFavoritos(prev => [...prev, id]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchTerm.trim() ? `/list-produto?search=${encodeURIComponent(searchTerm)}` : '/list-produto');
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
        <Container maxWidth="xl" sx={{ py: 8, flexGrow: 1 }}>
          <Typography variant="h2" align="center" sx={{ mb: 6, color: 'secondary.main', fontSize: { xs: '2rem', md: '3rem' } }}>
            {searchTerm ? `Resultados para: "${searchTerm}"` : 'Nossas Obras'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Search component="form" onSubmit={handleSearch} sx={{ maxWidth: 600 }}>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase
                placeholder="Pesquisar livros, autores..."
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
                      width: '100%', maxWidth: '320px', height: '550px',
                      display: 'flex', flexDirection: 'column',
                      cursor: 'pointer'
                    }}
                  >
                    <Box sx={{ position: 'relative', height: '350px', flexShrink: 0 }}>
                      <CardMedia 
                        component="img" 
                        image={produto.url_capa} 
                        sx={{ height: '100%', objectFit: 'cover' }} 
                      />
                      <IconButton 
                        onClick={(e) => handleToggleFavorito(e, produto.id)}
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: favoritos.includes(produto.id) ? '#ff1744' : 'white' }}
                      >
                        {favoritos.includes(produto.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'secondary.main', height: '2.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {produto.titulo}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>{produto.autor}</Typography>
                      </Box>
                      <Typography variant="h5" sx={{ mt: 2 }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco || 0)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Modal de Detalhes - AGORA RESPONSIVO */}
        <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
          <Fade in={open}>
            <Box sx={modalStyle}>
              {/* Botão de fechar fixo no topo direito do modal */}
              <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: 'secondary.main', zIndex: 10 }}><CloseIcon /></IconButton>
              
              {selectedProduto && (
                <>
                  <Box sx={{ flex: { xs: 'none', md: 1 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardMedia 
                        component="img" 
                        sx={{ 
                            maxHeight: { xs: '250px', md: '450px' }, 
                            width: 'auto', 
                            objectFit: 'contain',
                            borderRadius: '4px'
                        }} 
                        image={selectedProduto.url_capa} 
                    />
                  </Box>

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" sx={{ color: 'secondary.main', fontSize: { xs: '1.5rem', md: '2.1rem' } }}>{selectedProduto.titulo}</Typography>
                    <Typography variant="h6" sx={{ fontStyle: 'italic', color: '#aaa', mb: 1 }}>{selectedProduto.autor}</Typography>
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography sx={{ mb: 2, color: '#ccc', textAlign: 'justify', fontSize: '0.95rem' }}>
                        {selectedProduto.descricao}
                    </Typography>

                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                            <Inventory fontSize="small" sx={{ mr: 1, color: 'secondary.main' }}/>
                            <Typography variant="caption">{selectedProduto.genero}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center">
                            <CalendarToday fontSize="small" sx={{ mr: 1, color: 'secondary.main' }}/>
                            <Typography variant="caption">{selectedProduto.ano_publicacao}</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Button variant="contained" color="secondary" fullWidth sx={{ mt: 'auto', py: 1.5 }} onClick={() => setOpenPdf(true)}>
                        Ler Obra
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>

        {/* Modal PDF - Também com ajuste de altura */}
        <Modal open={openPdf} onClose={() => setOpenPdf(false)}>
          <Box sx={{ position: 'absolute', top: '2%', left: '2%', width: '96%', height: '96%', bgcolor: '#1e1e1e', border: '2px solid #C7A34F', borderRadius: '8px', overflow: 'hidden' }}>
            <Box sx={{ p: 1, bgcolor: '#C7A34F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'black', fontWeight: 'bold', fontSize: '0.9rem', ml: 1 }}>{selectedProduto?.titulo}</Typography>
              <IconButton onClick={() => setOpenPdf(false)}><CloseIcon sx={{ color: 'black' }} /></IconButton>
            </Box>
            <iframe src={selectedProduto?.url_arquivo_pdf} width="100%" height="100%" style={{ border: 'none' }} title="Leitor PDF"/>
          </Box>
        </Modal>

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
        <FooterComponent />
      </Box>
    </ThemeProvider>
  );
};

export default ListProduto;