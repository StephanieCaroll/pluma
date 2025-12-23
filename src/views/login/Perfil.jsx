import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Paper, Typography, TextField, Button, 
  CircularProgress, Divider, Fade, Snackbar, Alert, CssBaseline,
  Avatar, IconButton, Tooltip, Grid, Card, CardMedia, Modal
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LogoutIcon from '@mui/icons-material/Logout';
import BookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../../services/supabaseClient';
import { FooterComponent } from '../../MenuSistema';
import { useNavigate } from 'react-router-dom';

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#280000' },
    secondary: { main: '#C7A34F' },
    background: { default: '#0A0A0A', paper: '#121212' },
    text: { primary: '#F0F0F0', secondary: '#C7A34F' }
  }
});

const pdfModalStyle = {
  position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%',
  bgcolor: '#000', border: '2px solid #C7A34F', boxShadow: 24, outline: 'none',
  display: 'flex', flexDirection: 'column'
};

const Perfil = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ username: '', email: '', avatar_url: '' });
  const [meusLivros, setMeusLivros] = useState([]);
  const [pdfAtivo, setPdfAtivo] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) { navigate('/form-login'); return; }
        setUser(currentUser);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, email, avatar_url')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (profileData) {
          setProfile({
            username: profileData.username || '',
            email: profileData.email || currentUser.email,
            avatar_url: profileData.avatar_url || ''
          });
        }

        const { data: pedidosData } = await supabase
          .from('pedidos')
          .select('produtos_ids')
          .eq('usuario_id', currentUser.id);

        if (pedidosData && pedidosData.length > 0) {
          const todosIds = [...new Set(pedidosData.flatMap(p => p.produtos_ids))];
          if (todosIds.length > 0) {
            const { data: livrosData } = await supabase
              .from('produtos')
              .select('id, titulo, url_capa, url_arquivo_pdf')
              .in('id', todosIds);
            setMeusLivros(livrosData || []);
          }
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase.from('profiles').update({ username: profile.username }).eq('id', user.id);
      if (error) throw error;
      setSnackbar({ open: true, message: 'Perfil atualizado!', severity: 'success' });
      setIsEditing(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro: ' + error.message, severity: 'error' });
    } finally { setUpdating(false); }
  };

  const handleFileUpload = async (event) => {
    try {
      setUpdating(true);
      const file = event.target.files[0];
      if (!file) return;
      const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      await supabase.storage.from('avatars').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      setSnackbar({ open: true, message: 'Foto atualizada!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro no upload.', severity: 'error' });
    } finally { setUpdating(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0A0A0A' }}>
      <CircularProgress color="secondary" />
    </Box>
  );

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
        <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
          <Grid container spacing={4}>
            
            {/* DADOS DO PERFIL */}
            <Grid item xs={12} md={4}>
              <Paper elevation={8} sx={{ p: 4, border: '1px solid rgba(199, 163, 79, 0.3)', bgcolor: '#121212', position: 'relative' }}>
                {!isEditing && (
                  <IconButton onClick={() => setIsEditing(true)} sx={{ position: 'absolute', top: 10, right: 10, color: 'secondary.main' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar src={profile.avatar_url} sx={{ width: 100, height: 100, border: '2px solid #C7A34F', mb: 2, bgcolor: '#280000' }}>
                      {profile.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileUpload} />
                    <IconButton 
                      onClick={() => fileInputRef.current.click()} 
                      sx={{ position: 'absolute', bottom: 10, right: -5, bgcolor: 'secondary.main', color: '#000', '&:hover': { bgcolor: '#E8C87E' } }} 
                      size="small"
                    >
                      <PhotoCameraIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: 'Cinzel', color: 'secondary.main' }}>{profile.username}</Typography>
                </Box>

                <Divider sx={{ mb: 3, bgcolor: 'rgba(199,163,79,0.1)' }} />

                {isEditing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Username" size="small" value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value.toLowerCase()})} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button fullWidth variant="contained" color="secondary" onClick={handleUpdate} disabled={updating}>Salvar</Button>
                      <Button fullWidth variant="outlined" onClick={() => setIsEditing(false)}>Cancelar</Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="caption" color="secondary">E-MAIL</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>{profile.email}</Typography>
                    <Button variant="text" color="error" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ mt: 2, textTransform: 'none' }}>Sair da Conta</Button>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* MINHA COLEÇÃO */}
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontFamily: 'Cinzel', color: 'secondary.main', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <BookIcon /> Minha Coleção
              </Typography>
              
              {meusLivros.length > 0 ? (
                <Grid container spacing={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                  {meusLivros.map((livro) => (
                    <Grid item key={livro.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Card 
                        onClick={() => setPdfAtivo(livro.url_arquivo_pdf)}
                        sx={{ 
                          width: '180px', 
                          height: '320px', 
                          cursor: 'pointer', 
                          bgcolor: '#121212', 
                          border: '1px solid rgba(199,163,79,0.2)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '0.3s', 
                          '&:hover': { transform: 'scale(1.05)', borderColor: 'secondary.main', boxShadow: '0 0 15px rgba(199, 163, 79, 0.3)' }
                        }}
                      >
                        <Box sx={{ height: '250px', overflow: 'hidden' }}>
                          <CardMedia 
                            component="img" 
                            image={livro.url_capa} 
                            sx={{ height: '100%', objectFit: 'cover' }} 
                            alt={livro.titulo}
                          />
                        </Box>
                        <Box sx={{ p: 1.5, textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'secondary.main', 
                              fontWeight: 'bold', 
                              lineHeight: '1.2em',
                              height: '2.4em',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {livro.titulo}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'rgba(199, 163, 79, 0.05)', border: '1px dashed #C7A34F' }}>
                  <Typography sx={{ mb: 3, fontStyle: 'italic' }}>Sua estante está vazia. O que deseja ler hoje?</Typography>
                  <Button variant="contained" color="secondary" onClick={() => navigate('/list-produto')}>Explorar Acervo</Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>

        {/* LEITOR DE PDF */}
        <Modal open={!!pdfAtivo} onClose={() => setPdfAtivo(null)}>
          <Box sx={pdfModalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#C7A34F' }}>
              <Typography sx={{ color: '#000', fontWeight: 'bold', ml: 2 }}>Manuscrito Pluma</Typography>
              <IconButton onClick={() => setPdfAtivo(null)} sx={{ color: '#000' }}><CloseIcon /></IconButton>
            </Box>
            <iframe src={pdfAtivo} width="100%" height="100%" style={{ border: 'none' }} title="Leitor" />
          </Box>
        </Modal>

        <FooterComponent />
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ border: '1px solid #C7A34F', bgcolor: '#121212', color: '#F0F0F0' }}>{snackbar.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Perfil;