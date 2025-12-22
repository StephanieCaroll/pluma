import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Typography, Box, Button, Container, Paper, IconButton, Divider, CssBaseline, 
  CircularProgress, Modal, TextField, Grid, Snackbar, Alert, Radio, RadioGroup, 
  FormControlLabel, FormControl
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Payment as PaymentIcon, 
  QrCode as QrCodeIcon, 
  Close as CloseIcon,
  MenuBook as BookIcon 
} from '@mui/icons-material';
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

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 500 }, bgcolor: '#121212', border: '2px solid #C7A34F',
  boxShadow: 24, p: 4, outline: 'none'
};

const pdfModalStyle = {
  position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%',
  bgcolor: '#000', border: '2px solid #C7A34F', boxShadow: 24, outline: 'none',
  display: 'flex', flexDirection: 'column'
};

const Carrinho = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estaLogado, setEstaLogado] = useState(true);
  
  // Estados de Pagamento
  const [openCheckout, setOpenCheckout] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState('cartao');
  const [finalizando, setFinalizando] = useState(false);
  
  // Estados de Entrega (PDF)
  const [openEntrega, setOpenEntrega] = useState(false);
  const [livrosComprados, setLivrosComprados] = useState([]);
  const [pdfAtivo, setPdfAtivo] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setEstaLogado(false); setLoading(false); return; }

      const { data, error } = await supabase
        .from('carrinho')
        .select('id, produto_id, produtos(titulo, preco, url_capa, url_arquivo_pdf)')
        .eq('usuario_id', user.id);

      if (error) throw error;
      setCartItems(data.map(item => ({
        id: item.id,
        produto_id: item.produto_id,
        name: item.produtos.titulo,
        price: item.produtos.preco,
        imageUrl: item.produtos.url_capa,
        pdfUrl: item.produtos.url_arquivo_pdf
      })));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemoveItem = async (id) => {
    const { error } = await supabase.from('carrinho').delete().eq('id', id);
    if (!error) setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleFinalizarPagamento = async () => {
    setFinalizando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const ids = cartItems.map(item => item.produto_id);
     
      const { error: orderError } = await supabase
        .from('pedidos')
        .insert([{ usuario_id: user.id, total: subtotal, status: 'pago', produtos_ids: ids }]);
      if (orderError) throw orderError;

      await supabase.from('carrinho').delete().eq('usuario_id', user.id);

      setLivrosComprados([...cartItems]);
      setOpenCheckout(false);
      setOpenEntrega(true);
      
      setSnackbar({ open: true, message: 'Ritual completo! Seus manuscritos foram liberados.', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Falha no processo: ' + error.message, severity: 'error' });
    } finally {
      setFinalizando(false);
    }
  };

  if (!estaLogado) {
    return (
      <ThemeProvider theme={gothicTheme}>
        <CssBaseline /><Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
          <Container maxWidth="sm" sx={{ py: 10, flexGrow: 1 }}>
            <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid #C7A34F' }}>
              <Typography variant="h5" sx={{ mb: 3, color: 'secondary.main', fontFamily: 'Cinzel' }}>Acesso Restrito</Typography>
              <Button variant="contained" color="secondary" onClick={() => navigate('/form-login')}>Entrar Agora</Button>
            </Paper>
          </Container><FooterComponent /></Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
        <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
          <Paper elevation={8} sx={{ p: { xs: 3, md: 6 }, border: '1px solid rgba(199, 163, 79, 0.3)', bgcolor: '#121212' }}>
            <Typography variant="h2" align="center" sx={{ color: 'secondary.main', mb: 6, fontFamily: 'Cinzel' }}>Seu Carrinho</Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress color="secondary" /></Box>
            ) : cartItems.length > 0 ? (
              <Box>
                {cartItems.map((item) => (
                  <Box key={item.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Box component="img" src={item.imageUrl} sx={{ width: 80, height: 110, objectFit: 'cover', border: '1px solid #C7A34F' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Cinzel' }}>{item.name}</Typography>
                        <Typography variant="body1" sx={{ color: 'secondary.main' }}>R$ {item.price.toFixed(2)}</Typography>
                      </Box>
                      <IconButton onClick={() => handleRemoveItem(item.id)} sx={{ color: '#ff4444' }}><DeleteIcon /></IconButton>
                    </Box>
                    <Divider sx={{ bgcolor: 'rgba(199, 163, 79, 0.1)' }} />
                  </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, p: 2, bgcolor: 'rgba(199, 163, 79, 0.05)' }}>
                  <Typography variant="h4" sx={{ color: 'secondary.main' }}>Total: R$ {subtotal.toFixed(2)}</Typography>
                </Box>
                <Button variant="contained" color="secondary" fullWidth sx={{ mt: 4, py: 2, fontWeight: 'bold' }} onClick={() => setOpenCheckout(true)}>Finalizar Compra</Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>Seu baú de livros está vazio.</Typography>
                <Button variant="outlined" color="secondary" onClick={() => navigate('/list-produto')}>Explorar Acervo</Button>
              </Box>
            )}
          </Paper>
        </Container>

        {/* MODAL DE CHECKOUT COM SELEÇÃO DE PAGAMENTO */}
        <Modal open={openCheckout} onClose={() => !finalizando && setOpenCheckout(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h5" sx={{ fontFamily: 'Cinzel', color: 'secondary.main', mb: 3, textAlign: 'center' }}>Forma de Pagamento</Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
              <RadioGroup value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)}>
                <Paper sx={{ p: 1, mb: 1, border: metodoPagamento === 'cartao' ? '1px solid #C7A34F' : 'none' }}>
                  <FormControlLabel value="cartao" control={<Radio color="secondary" />} label="Cartão de Crédito" />
                </Paper>
                <Paper sx={{ p: 1, border: metodoPagamento === 'pix' ? '1px solid #C7A34F' : 'none' }}>
                  <FormControlLabel value="pix" control={<Radio color="secondary" />} label="PIX (Aprovação Instantânea)" />
                </Paper>
              </RadioGroup>
            </FormControl>

            {metodoPagamento === 'cartao' ? (
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField fullWidth label="Nome no Cartão" size="small" /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Número" size="small" /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Validade" size="small" /></Grid>
                <Grid item xs={6}><TextField fullWidth label="CVV" size="small" /></Grid>
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed #C7A34F' }}>
                <QrCodeIcon sx={{ fontSize: 100, color: 'secondary.main' }} />
                <Typography variant="body2">Escaneie o código após confirmar</Typography>
              </Box>
            )}

            <Button 
              variant="contained" color="secondary" fullWidth sx={{ mt: 3, fontWeight: 'bold' }}
              onClick={handleFinalizarPagamento} disabled={finalizando}
            >
              {finalizando ? <CircularProgress size={24} /> : `Pagar R$ ${subtotal.toFixed(2)}`}
            </Button>
          </Box>
        </Modal>

        {/* MODAL DE ENTREGA DOS LIVROS (PÓS-PAGAMENTO) */}
        <Modal open={openEntrega}>
          <Box sx={modalStyle}>
            <Typography variant="h5" sx={{ fontFamily: 'Cinzel', color: 'secondary.main', mb: 3, textAlign: 'center' }}>Acesso Liberado!</Typography>
            <Typography variant="body2" sx={{ mb:3, textAlign: 'center' }}>Clique no livro para abrir o manuscrito:</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {livrosComprados.map(livro => (
                <Button 
                  key={livro.id} variant="outlined" color="secondary" 
                  startIcon={<BookIcon />} onClick={() => setPdfAtivo(livro.pdfUrl)}
                >
                  Abrir {livro.name}
                </Button>
              ))}
            </Box>
            <Button fullWidth sx={{ mt: 4 }} onClick={() => navigate('/')}>Voltar à Loja</Button>
          </Box>
        </Modal>

        {/* MODAL DO LEITOR DE PDF */}
        <Modal open={!!pdfAtivo} onClose={() => setPdfAtivo(null)}>
          <Box sx={pdfModalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, bgcolor: '#C7A34F' }}>
              <IconButton onClick={() => setPdfAtivo(null)} size="small" sx={{ color: '#000' }}><CloseIcon /></IconButton>
            </Box>
            <iframe src={pdfAtivo} width="100%" height="100%" style={{ border: 'none' }} title="Leitor Pluma" />
          </Box>
        </Modal>

        <FooterComponent />
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Carrinho;