import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  alpha,
  styled,
  Typography,
  Container,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { GlobalStyles } from '@mui/material';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { supabase } from './services/supabaseClient';

const gold = 'rgba(199, 163, 79, 1)';
const goldLight = 'rgba(199, 163, 79, 0.7)';
const backgroundDark = '#000';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha(gold, 0.1),
  '&:hover': { backgroundColor: alpha(gold, 0.2) },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { width: 400 },
  border: `1px solid ${alpha(gold, 0.3)}`
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  fontFamily: '"Crimson Text", serif',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: theme.spacing(2),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export const FooterComponent = () => {
  return (
    <Box component="footer" sx={{ py: { xs: 3, md: 6 }, borderTop: '1px solid rgba(199, 163, 79, 0.1)', backgroundColor: backgroundDark }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Grid item xs={12} md={4} sx={{ mb: { xs: 2, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" gutterBottom sx={{ color: gold, fontFamily: 'Cinzel' }}>Pluma</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Crimson Text' }}>Uma biblioteca dedicada à preservação e celebração da literatura gótica e de horror.</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 2, md: 0 } }}>
            <Typography variant="subtitle1" sx={{ color: gold, mb: 1 }}>Navegar</Typography>
            {['Início', 'Livros', 'Autores'].map((item) => (
              <Typography key={item} variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: gold } }}>{item}</Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 2, md: 0 } }}>
            <Typography variant="subtitle1" sx={{ color: gold, mb: 1 }}>Legal</Typography>
            {['Termos', 'Privacidade'].map((item) => (
              <Typography key={item} variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: gold } }}>{item}</Typography>
            ))}
          </Grid>
        </Grid>
        <Divider sx={{ my: { xs: 2, md: 4 }, bgcolor: 'rgba(199, 163, 79, 0.1)' }} />
        <Typography variant="body2" align="center">© {new Date().getFullYear()} Pluma. Todos os direitos reservados.</Typography>
      </Container>
    </Box>
  );
};

const MenuSistema = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUsuarioLogado(!!user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUsuarioLogado(!!session);
    });

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('produtos').select('genero');
      if (error) throw error;
      const listaUnica = [...new Set(data.map(item => item.genero).filter(g => g))];
      setCategorias(listaUnica.sort());
    } catch (error) {
      console.error('Erro ao buscar categorias:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchCategorias();
  };

  return (
    <>
      <GlobalStyles styles={{
        'body': { overflowX: 'hidden', '&::-webkit-scrollbar': { display: 'none' } }
      }} />
      <AppBar position="static" sx={{ backgroundColor: backgroundDark, boxShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', pt: 1, pb: 0 }}>
          <Box sx={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
            px: { xs: 1, sm: 2, md: 4 }, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 0 }
          }}>
            {/* LOGO */}
            <Box component={Link} to="/" sx={{ display: 'flex' }}>
              <Box component="img" src="/PlumaLogoPrincipal.png" alt="Logo Pluma" sx={{ height: { xs: 80, md: 150 }, width: 'auto' }} />
            </Box>

            {/* NAVEGAÇÃO CENTRAL */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, width: '100%' }}>
              <Typography sx={{ color: 'white', fontFamily: '"Cinzel", serif', mb: 1, letterSpacing: '0.1em' }}>
                Encontre seu Próximo Livro Favorito
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: 2 }}>
                <Button component={Link} to="/" sx={{ color: 'white', fontFamily: '"Crimson Text", serif', '&:hover': { color: gold } }}>Home</Button>
                <Button component={Link} to="/list-produto" sx={{ color: 'white', fontFamily: '"Crimson Text", serif', '&:hover': { color: gold } }}>Produtos</Button>
                <Button
                  onClick={handleMenuOpen}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MenuBookIcon />}
                  sx={{ color: 'white', fontFamily: '"Crimson Text", serif', '&:hover': { color: gold } }}
                >
                  Categorias
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{ sx: { backgroundColor: '#1e1e1e', color: 'white', minWidth: '150px', border: `1px solid ${gold}` } }}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat} onClick={() => { setAnchorEl(null); navigate('/list-produto', { state: { categoria: cat } }); }} sx={{ '&:hover': { color: gold } }}>
                      {cat}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>

            {/* ÍCONES DA DIREITA */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
              
              {/* Login / Perfil */}
              <IconButton 
                onClick={() => navigate(usuarioLogado ? '/perfil' : '/form-login')} 
                sx={{ color: usuarioLogado ? gold : 'white', transition: '0.3s' }}
              >
                <AccountCircleIcon />
                {usuarioLogado && <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.6rem', fontWeight: 'bold' }}>ON</Typography>}
              </IconButton>

              {/* Favoritos */}
             <IconButton 
  onClick={() => {
    console.log("Tentando navegar para favoritos...");
    navigate('/favoritos');
  }} 
  sx={{ color: 'white', '&:hover': { color: gold } }}
>
  <FavoriteIcon />
</IconButton>

              {/* Carrinho */}
              <IconButton onClick={() => navigate('/carrinho')} sx={{ color: 'white', '&:hover': { color: gold } }}>
                <ShoppingCartIcon />
              </IconButton>

            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MenuSistema;