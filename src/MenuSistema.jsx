import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { GlobalStyles } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Cores do rodapé
const gold = 'rgba(199, 163, 79, 1)';
const goldLight = 'rgba(199, 163, 79, 0.7)';
const backgroundDark = '#000';

// Estilização da barra de pesquisa
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha(gold, 0.1),
  '&:hover': {
    backgroundColor: alpha(gold, 0.2),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 400,
  },
  border: `1px solid ${alpha(gold, 0.3)}`
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: gold,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  fontFamily: '"Crimson Text", serif',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

// Novo componente de rodapé
export const FooterComponent = () => {
  return (
    <Box component="footer" sx={{ py: { xs: 3, md: 6 }, borderTop: '1px solid rgba(199, 163, 79, 0.1)', backgroundColor: 'backgroundDark' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Grid item xs={12} md={4} sx={{ mb: { xs: 2, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
              Pluma
            </Typography>
            <Typography variant="body2">
              Uma biblioteca dedicada à preservação e celebração da literatura gótica e de horror.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 2, md: 0 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Navegar
            </Typography>
            {['Início', 'Livros', 'Autores', 'Coleções'].map((item) => (
              <Typography key={item} variant="body2" sx={{ mb: 1 }}>
                {item}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 2, md: 0 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Legal
            </Typography>
            {['Termos', 'Privacidade', 'Cookies'].map((item) => (
              <Typography key={item} variant="body2" sx={{ mb: 1 }}>
                {item}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' }, mb: { xs: 2, md: 0 } }}>
            {/* Espaço para redes sociais ou outros itens futuros */}
          </Grid>
        </Grid>
        <Divider sx={{ my: { xs: 2, md: 4 } }} />
        <Typography variant="body2" align="center" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
          © {new Date().getFullYear()} Pluma. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

const MenuSistema = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Termo pesquisado:', searchTerm);
    if (searchTerm.trim()) {
      navigate(`/list-produto?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/list-produto'); // Remove o parâmetro se a busca estiver vazia
    }
  };

  return (
    <>
      <GlobalStyles styles={{
        'body': {
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }
      }} />
      <AppBar position="static" sx={{ backgroundColor: backgroundDark, boxShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', pt: 1, pb: 0 }}>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 1, sm: 2, md: 4 },
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 0 }
          }}>
            {/* Logo */}
            <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, width: { xs: '100%', md: 'auto' }, mb: { xs: 2, md: 0 } }}>
              <Box
                component="img"
                src="/PlumaLogoPrincipal.png"
                alt="Logo Pluma"
                sx={{ height: { xs: 80, sm: 120, md: 200 }, width: { xs: 80, sm: 120, md: 200 } }}
              />
            </Box>

            {/* Frase + Barra de pesquisa + Navegação */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1, mx: { xs: 0, md: 2 }, width: '100%' }}>
              <Box sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: 'white',
                fontWeight: 500,
                fontFamily: '"UnifrakturMaguntia", cursive',
                textAlign: 'center',
                mb: { xs: 1, md: 0 }
              }}>
                Encontre seu Próximo Livro Favorito
              </Box>

              {/* Navegação logo abaixo da barra de pesquisa */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                mt: 1,
                flexWrap: 'wrap',
                gap: { xs: 1, md: 2 }
              }}>
                <Button component={Link} to="/" sx={{ color: 'white', fontWeight: 500, fontFamily: '"Crimson Text", serif', fontSize: { xs: '0.9rem', md: '1rem' }, transition: '0.3s', '&:hover': { color: goldLight } }}>Home</Button>
                <Button component={Link} to="/list-cliente" sx={{ color: 'white', fontWeight: 500, fontFamily: '"Crimson Text", serif', fontSize: { xs: '0.9rem', md: '1rem' }, transition: '0.3s', '&:hover': { color: goldLight } }}>Cliente</Button>
                <Button component={Link} to="/list-produto" sx={{ color: 'white', fontWeight: 500, fontFamily: '"Crimson Text", serif', fontSize: { xs: '0.9rem', md: '1rem' }, transition: '0.3s', '&:hover': { color: goldLight } }}>Produto</Button>
                <Button
                  onClick={handleMenuOpen}
                  startIcon={<MenuBookIcon />}
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    fontFamily: '"Crimson Text", serif',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    transition: '0.3s', '&:hover': { color: goldLight }
                  }}
                >
                  Categorias
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#1e1e1e',
                      color: 'white',
                      fontFamily: '"Crimson Text", serif'
                    }
                  }}
                >
                  <MenuItem onClick={handleMenuClose} component={Link} to="/categoria/ficcao">Ficção</MenuItem>
                  <MenuItem onClick={handleMenuClose} component={Link} to="/categoria/horror">Horror</MenuItem>
                  <MenuItem onClick={handleMenuClose} component={Link} to="/categoria/gotico">Gótico</MenuItem>
                  <MenuItem onClick={handleMenuClose} component={Link} to="/categoria/misterio">Mistério</MenuItem>
                </Menu>
              </Box>
            </Box>

            {/* Ícones à direita */}
            <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, mt: { xs: 2, md: 0 }, justifyContent: { xs: 'center', md: 'flex-end' }, width: { xs: '100%', md: 'auto' } }}>
              <IconButton onClick={() => navigate('/form-login')} sx={{ color: 'white', transition: '0.3s', '&:hover': { color: goldLight } }}>
                <AccountCircleIcon />
              </IconButton>
              <IconButton sx={{ color: 'white', transition: '0.3s', '&:hover': { color: goldLight } }}><FavoriteBorderIcon /></IconButton>
              <IconButton onClick={() => navigate('/carrinho')} sx={{ color: 'white', transition: '0.3s', '&:hover': { color: goldLight } }}><ShoppingCartIcon /></IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MenuSistema;