import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Box,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Modal,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import {
  Delete,
  Edit,
  Add,
  Description,
  Language,
  MenuBook,
  CalendarToday,
  AttachFile,
  Inventory,
  AttachMoney,
  Visibility,
  Close,
  PictureAsPdf,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { FooterComponent } from '../../MenuSistema';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

const estilosPDF = StyleSheet.create({
  pagina: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  secao: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  cabecalho: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#C7A34F',
    fontWeight: 'bold'
  },
  containerLivro: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottom: '1px solid #DDD',
    paddingBottom: 15
  },
  imagemLivro: {
    width: 100,
    height: 150,
    marginRight: 15
  },
  detalhesLivro: {
    flex: 1
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  autor: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#666'
  },
  detalhe: {
    fontSize: 12,
    marginBottom: 3,
    color: '#444'
  },
  rotuloDetalhe: {
    fontWeight: 'bold'
  },
  numeroPagina: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
});

const MeuDocumentoPDF = ({ livros }) => (
  <Document>
    <Page size="A4" style={estilosPDF.pagina}>
      <View style={estilosPDF.secao}>
        <Text style={estilosPDF.cabecalho}>Catálogo de Livros</Text>
        {livros.map((livro, index) => (
          <View key={index} style={estilosPDF.containerLivro}>
            <Image 
              style={estilosPDF.imagemLivro} 
              src={livro.urlCapa || 'https://via.placeholder.com/100x150?text=Sem+Capa'} 
            />
            <View style={estilosPDF.detalhesLivro}>
              <Text style={estilosPDF.titulo}>{livro.titulo}</Text>
              <Text style={estilosPDF.autor}>{livro.autor}</Text>
              <Text style={estilosPDF.detalhe}>
                <Text style={estilosPDF.rotuloDetalhe}>Gênero: </Text>{livro.genero}
              </Text>
              <Text style={estilosPDF.detalhe}>
                <Text style={estilosPDF.rotuloDetalhe}>Preço: </Text>R$ {livro.preco.toFixed(2)}
              </Text>
              <Text style={estilosPDF.detalhe}>
                <Text style={estilosPDF.rotuloDetalhe}>Páginas: </Text>{livro.numeroPaginas}
              </Text>
              <Text style={estilosPDF.detalhe}>
                <Text style={estilosPDF.rotuloDetalhe}>Ano: </Text>{livro.anoPublicacao}
              </Text>
              <Text style={estilosPDF.detalhe}>
                <Text style={estilosPDF.rotuloDetalhe}>Estoque: </Text>{livro.estoque}
              </Text>
            </View>
          </View>
        ))}
        <Text style={estilosPDF.numeroPagina} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </View>
    </Page>
  </Document>
);

const HomeGerenciador = () => {
  const tema = useTheme();
  const telaPequena = useMediaQuery(tema.breakpoints.down('sm'));
  const inputArquivoRef = useRef(null);
  
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [mensagemSnackbar, setMensagemSnackbar] = useState('');
  const [severidadeSnackbar, setSeveridadeSnackbar] = useState('success');
  const [favoritos, setFavoritos] = useState([]);
  
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
  const [livroParaDeletar, setLivroParaDeletar] = useState(null);
  const [visualizadorPdfAberto, setVisualizadorPdfAberto] = useState(false);
  const [urlPdf, setUrlPdf] = useState('');
  
  const [livroEditando, setLivroEditando] = useState({
    id: null,
    titulo: '',
    autor: '',
    genero: '',
    preco: 0,
    descricao: '',
    anoPublicacao: new Date().getFullYear(),
    urlCapa: '',
    urlArquivoPDF: '',
    numeroPaginas: 0,
    idioma: '',
    estoque: 0,
    arquivoPDF: null,
  });

  useEffect(() => {
    const carregarLivros = async () => {
      try {
        setCarregando(true);
        const resposta = await api.get('/livros');
        setLivros(resposta.data);
        setErro(null);
      } catch (err) {
        console.error('Erro ao carregar livros:', err);
        setErro('Erro ao carregar livros');
        mostrarSnackbar(`Erro: ${err.response?.data?.message || err.message}`, 'error');
      } finally {
        setCarregando(false);
      }
    };
    
    carregarLivros();
  }, []);

  useEffect(() => {
    return () => {
      if (urlPdf && urlPdf.startsWith('blob:')) {
        URL.revokeObjectURL(urlPdf);
      }
    };
  }, [urlPdf]);

  const toggleFavorito = (livroId) => {
    if (favoritos.includes(livroId)) {
      setFavoritos(favoritos.filter(id => id !== livroId));
    } else {
      setFavoritos([...favoritos, livroId]);
    }
  };

  const ehFavorito = (livroId) => {
    return favoritos.includes(livroId);
  };

  const mostrarSnackbar = (mensagem, severidade) => {
    setMensagemSnackbar(mensagem);
    setSeveridadeSnackbar(severidade);
    setSnackbarAberto(true);
  };

  const fecharSnackbar = () => {
    setSnackbarAberto(false);
  };

const abrirVisualizadorPDF = (url) => {
    if (!url) {
      mostrarSnackbar('Nenhum PDF disponível para este livro', 'warning');
      return;
    }

    let urlPdfParaMostrar = url;
    
    if (url instanceof File) {
      // Se for um arquivo novo ainda não enviado ao servidor
      urlPdfParaMostrar = URL.createObjectURL(url);
    } else {
      // Extrai apenas o nome do arquivo (remove '/uploads/' se existir)
      const nomeArquivo = url.split('/').pop();
      urlPdfParaMostrar = `http://localhost:8080/api/arquivos/livro/${encodeURIComponent(nomeArquivo)}`;
    }

    setUrlPdf(urlPdfParaMostrar);
    setVisualizadorPdfAberto(true);
};

  const fecharVisualizadorPDF = () => {
    setVisualizadorPdfAberto(false);
  };

  const abrirModal = (livro) => {
    setLivroSelecionado(livro);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const abrirModalEdicao = (livro) => {
    setLivroEditando(livro || {
      id: null,
      titulo: '',
      autor: '',
      genero: '',
      preco: 0,
      descricao: '',
      anoPublicacao: new Date().getFullYear(),
      urlCapa: '',
      urlArquivoPDF: '',
      numeroPaginas: 0,
      idioma: '',
      estoque: 0,
      arquivoPDF: null,
    });
    setModalEdicaoAberto(true);
  };

  const fecharModalEdicao = () => {
    setModalEdicaoAberto(false);
  };

  const abrirModalConfirmacao = (livro) => {
    setLivroParaDeletar(livro);
    setModalConfirmacaoAberto(true);
  };

  const fecharModalConfirmacao = () => {
    setModalConfirmacaoAberto(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLivroEditando(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      setLivroEditando(prev => ({
        ...prev,
        arquivoPDF: arquivo,
        urlArquivoPDF: arquivo.name
      }));
    }
  };

  const acionarInputArquivo = () => {
    inputArquivoRef.current.click();
  };

  const adicionarLivro = async (livroData) => {
  try {
    setCarregando(true);
    
    if (!livroData.titulo?.trim() || !livroData.autor?.trim() || !livroData.genero?.trim()) {
      throw new Error("Preencha todos os campos obrigatórios (Título, Autor, Gênero)");
    }

    const formData = new FormData();
    
    const livroObj = {
      titulo: livroData.titulo.trim(),
      autor: livroData.autor.trim(),
      genero: livroData.genero.trim(),
      preco: parseFloat(livroData.preco) || 0,
      descricao: livroData.descricao?.trim() || "",
      anoPublicacao: parseInt(livroData.anoPublicacao) || new Date().getFullYear(),
      urlCapa: livroData.urlCapa?.trim() || "https://via.placeholder.com/300x450?text=Capa+do+Livro",
      numeroPaginas: parseInt(livroData.numeroPaginas) || 0,
      idioma: livroData.idioma?.trim() || "Português",
      estoque: parseInt(livroData.estoque) || 0,
      urlArquivoPDF: livroData.urlArquivoPDF || ""
    };

    formData.append('livro', JSON.stringify(livroObj));
    
    if (livroData.arquivoPDF instanceof File) {
      formData.append('arquivo', livroData.arquivoPDF);
    }

    const response = await api.post('/livros', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Atualize desta forma para garantir que o estado anterior seja mantido
    setLivros(prevLivros => {
      // Verifique se o livro já existe para evitar duplicatas
      const livroExiste = prevLivros.some(l => l.id === response.data.id);
      return livroExiste ? prevLivros : [...prevLivros, response.data];
    });
    
    mostrarSnackbar('Livro adicionado com sucesso!', 'success');
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar livro:', error);
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Erro ao adicionar livro. Verifique os dados e tente novamente.';
    
    mostrarSnackbar(errorMessage, 'error');
    throw error;
  } finally {
    setCarregando(false);
  }
};

  const editarLivro = async (livroData) => {
    try {
      setCarregando(true);
      const formData = new FormData();
      
      const livroObj = {
        id: livroData.id,
        titulo: livroData.titulo.trim(),
        autor: livroData.autor.trim(),
        genero: livroData.genero.trim(),
        preco: parseFloat(livroData.preco) || 0,
        descricao: livroData.descricao?.trim() || "",
        anoPublicacao: parseInt(livroData.anoPublicacao) || new Date().getFullYear(),
        urlCapa: livroData.urlCapa?.trim() || "",
        numeroPaginas: parseInt(livroData.numeroPaginas) || 0,
        idioma: livroData.idioma?.trim() || "Português",
        estoque: parseInt(livroData.estoque) || 0,
        urlArquivoPDF: livroData.urlArquivoPDF || ""
      };

      formData.append('livro', JSON.stringify(livroObj));

      if (livroData.arquivoPDF) {
        formData.append('arquivo', livroData.arquivoPDF);
      }

      const response = await api.put(`/livros/${livroData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setLivros(prev => prev.map(l => l.id === livroData.id ? response.data : l));
      mostrarSnackbar('Livro atualizado com sucesso!', 'success');
      return response.data;
    } catch (error) {
      console.error('Erro ao editar livro:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao editar livro';
      mostrarSnackbar(errorMessage, 'error');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const salvarLivro = async () => {
    try {
      if (!livroEditando.titulo || !livroEditando.autor || !livroEditando.genero) {
        throw new Error("Preencha os campos obrigatórios: Título, Autor e Gênero");
      }

      if (livroEditando.id) {
        await editarLivro(livroEditando);
      } else {
        await adicionarLivro(livroEditando);
      }
      fecharModalEdicao();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
    }
  };

  const deletarLivro = async () => {
    try {
      setCarregando(true);
      await api.delete(`/livros/${livroParaDeletar.id}`);
      setLivros(prev => prev.filter(l => l.id !== livroParaDeletar.id));
      mostrarSnackbar('Livro deletado com sucesso!', 'success');
      fecharModalConfirmacao();
    } catch (err) {
      console.error('Erro ao deletar livro:', err);
      mostrarSnackbar(`Erro: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setCarregando(false);
    }
  };

  const estiloModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: telaPequena ? '95%' : '80%',
    maxWidth: '800px',
    bgcolor: '#1E1E1E',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
    color: '#FFFFFF',
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0A0A0A' }}>
      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>
            Gerenciador de Livros
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <PDFDownloadLink 
              document={<MeuDocumentoPDF livros={livros} />} 
              fileName="catalogo_livros.pdf"
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdf />}
                  disabled={loading || livros.length === 0}
                  sx={{ 
                    backgroundColor: '#D32F2F',
                    '&:hover': { backgroundColor: '#F44336' },
                    '&:disabled': { backgroundColor: '#5A5A5A' }
                  }}
                >
                  {loading ? 'Gerando PDF...' : 'Exportar PDF'}
                </Button>
              )}
            </PDFDownloadLink>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => abrirModalEdicao(null)}
              sx={{ 
                backgroundColor: '#C7A34F',
                '&:hover': { backgroundColor: '#D7B34F' },
                fontWeight: 'bold'
              }}
            >
              Novo Livro
            </Button>
          </Box>
        </Box>

        {carregando ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress sx={{ color: '#C7A34F' }} />
          </Box>
        ) : erro ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Typography color="error" variant="h6">{erro}</Typography>
          </Box>
        ) : livros.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="300px" textAlign="center">
            <Typography variant="h6" sx={{ color: '#C7A34F', mb: 2 }}>Nenhum livro cadastrado</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => abrirModalEdicao(null)}
              sx={{ backgroundColor: '#C7A34F', '&:hover': { backgroundColor: '#D7B34F' } }}
            >
              Adicionar Primeiro Livro
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {livros.map(livro => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={livro.id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#1E1E1E',
                  color: '#FFFFFF',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(199, 163, 79, 0.2)'
                  }
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={livro.urlCapa || 'https://via.placeholder.com/300x450?text=Sem+Capa'}
                      alt={livro.titulo}
                      sx={{ 
                        objectFit: 'cover',
                        width: '100%',
                        height: '250px',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=Sem+Capa'}
                    />
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(livro.id);
                      }}
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: ehFavorito(livro.id) ? '#FF4081' : '#FFFFFF',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        }
                      }}
                    >
                      {ehFavorito(livro.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" sx={{ 
                      color: '#C7A34F',
                      fontWeight: 'bold',
                      minHeight: '64px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {livro.titulo}
                    </Typography>
                    <Typography color="#AAAAAA" gutterBottom sx={{ fontStyle: 'italic' }}>
                      {livro.autor}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                      <MenuBook fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                      <Typography variant="body2" color="#AAAAAA">
                        {livro.numeroPaginas} páginas
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <AttachMoney fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                      <Typography variant="body2" color="#AAAAAA">
                        R$ {livro.preco.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      onClick={() => abrirModal(livro)}
                      sx={{ color: '#C7A34F', '&:hover': { backgroundColor: 'rgba(199, 163, 79, 0.1)' } }}
                    >
                      Detalhes
                    </Button>
                    <Box>
                      <IconButton 
                        onClick={() => abrirModalEdicao(livro)}
                        sx={{ color: '#C7A34F', '&:hover': { backgroundColor: 'rgba(199, 163, 79, 0.1)' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => abrirModalConfirmacao(livro)}
                        sx={{ color: '#E57373', '&:hover': { backgroundColor: 'rgba(229, 115, 115, 0.1)' } }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Modal open={modalAberto} onClose={fecharModal}>
        <Box sx={estiloModal}>
          {livroSelecionado && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Box
                  component="img"
                  src={livroSelecionado.urlCapa || 'https://via.placeholder.com/400x600?text=Sem+Capa'}
                  alt={livroSelecionado.titulo}
                  sx={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 2, boxShadow: 3 }}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/400x600?text=Sem+Capa'}
                />
                {livroSelecionado.urlArquivoPDF && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Description />}
                    onClick={() => abrirVisualizadorPDF(livroSelecionado.urlArquivoPDF)}
                    sx={{ mt: 2, color: '#C7A34F', borderColor: '#C7A34F', '&:hover': { borderColor: '#D7B34F' } }}
                  >
                    Ver PDF
                  </Button>
                )}
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h4" gutterBottom sx={{ color: '#C7A34F', fontWeight: 'bold' }}>
                  {livroSelecionado.titulo}
                </Typography>
                <Typography variant="h6" color="#AAAAAA" gutterBottom sx={{ fontStyle: 'italic' }}>
                  {livroSelecionado.autor}
                </Typography>
                <Divider sx={{ my: 2, backgroundColor: '#333333' }} />
                <Typography paragraph color="#CCCCCC" sx={{ lineHeight: 1.6 }}>
                  {livroSelecionado.descricao}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <Inventory fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                      <Typography variant="body2" color="#AAAAAA">
                        <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Gênero:</Box> {livroSelecionado.genero}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <Language fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                      <Typography variant="body2" color="#AAAAAA">
                        <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Idioma:</Box> {livroSelecionado.idioma}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <MenuBook fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                      <Typography variant="body2" color="#AAAAAA">
                        <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Páginas:</Box> {livroSelecionado.numeroPaginas}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarToday fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                      <Typography variant="body2" color="#AAAAAA">
                        <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Ano:</Box> {livroSelecionado.anoPublicacao}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <Inventory fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                      <Typography variant="body2" color="#AAAAAA">
                        <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Estoque:</Box> {livroSelecionado.estoque}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <AttachMoney fontSize="small" sx={{ mr: 1, color: '#C7A34F' }} />
                      <Typography variant="body2" color="#AAAAAA">
                        <Box component="span" sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Preço:</Box> R$ {livroSelecionado.preco.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={fecharModal}
                    sx={{ color: '#C7A34F', borderColor: '#C7A34F', '&:hover': { borderColor: '#D7B34F' } }}
                  >
                    Fechar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => { fecharModal(); abrirModalEdicao(livroSelecionado); }}
                    sx={{ backgroundColor: '#C7A34F', '&:hover': { backgroundColor: '#D7B34F' } }}
                  >
                    Editar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      <Modal open={modalEdicaoAberto} onClose={fecharModalEdicao}>
        <Box sx={estiloModal}>
          <Typography variant="h5" gutterBottom sx={{ color: '#C7A34F', mb: 3, fontWeight: 'bold' }}>
            {livroEditando.id ? 'Editar Livro' : 'Adicionar Novo Livro'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Título *"
                name="titulo"
                value={livroEditando.titulo}
                onChange={handleInputChange}
                margin="normal"
                required
                error={!livroEditando.titulo}
                helperText={!livroEditando.titulo ? "Campo obrigatório" : ""}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Autor *"
                name="autor"
                value={livroEditando.autor}
                onChange={handleInputChange}
                margin="normal"
                required
                error={!livroEditando.autor}
                helperText={!livroEditando.autor ? "Campo obrigatório" : ""}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Gênero *"
                name="genero"
                value={livroEditando.genero}
                onChange={handleInputChange}
                margin="normal"
                required
                error={!livroEditando.genero}
                helperText={!livroEditando.genero ? "Campo obrigatório" : ""}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="URL da Capa"
                name="urlCapa"
                value={livroEditando.urlCapa}
                onChange={handleInputChange}
                margin="normal"
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Idioma"
                name="idioma"
                value={livroEditando.idioma}
                onChange={handleInputChange}
                margin="normal"
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Preço"
                name="preco"
                type="number"
                value={livroEditando.preco}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Ano de Publicação"
                name="anoPublicacao"
                type="number"
                value={livroEditando.anoPublicacao}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0, max: new Date().getFullYear() } }}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Número de Páginas"
                name="numeroPaginas"
                type="number"
                value={livroEditando.numeroPaginas}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Estoque"
                name="estoque"
                type="number"
                value={livroEditando.estoque}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={livroEditando.descricao}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFFFFF' },
                  '& .MuiInputLabel-root': { color: '#AAAAAA' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555555' },
                    '&:hover fieldset': { borderColor: '#C7A34F' },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                ref={inputArquivoRef}
                onChange={handleFileUpload}
                accept=".pdf"
                style={{ display: 'none' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AttachFile />}
                  onClick={acionarInputArquivo}
                  sx={{ 
                    backgroundColor: '#3A3A3A',
                    color: '#FFFFFF',
                    '&:hover': { backgroundColor: '#4A4A4A' }
                  }}
                >
                  Anexar PDF
                </Button>
                {livroEditando.urlArquivoPDF && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={livroEditando.urlArquivoPDF}
                      onDelete={() => setLivroEditando({...livroEditando, urlArquivoPDF: '', arquivoPDF: null})}
                      deleteIcon={<Delete />}
                      sx={{ 
                        backgroundColor: '#2A2A2A',
                        color: '#FFFFFF',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    />
                    {livroEditando.urlArquivoPDF && (
                      <IconButton 
                        onClick={() => abrirVisualizadorPDF(livroEditando.urlArquivoPDF)}
                        sx={{ color: '#C7A34F' }}
                      >
                        <Visibility />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={fecharModalEdicao}
              sx={{ 
                color: '#C7A34F',
                borderColor: '#C7A34F',
                '&:hover': { borderColor: '#D7B34F' }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={salvarLivro}
              disabled={carregando || !livroEditando.titulo || !livroEditando.autor || !livroEditando.genero}
              sx={{ 
                backgroundColor: '#C7A34F',
                '&:hover': { backgroundColor: '#D7B34F' },
                '&:disabled': { backgroundColor: '#5A5A5A', color: '#9A9A9A' }
              }}
            >
              {carregando ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={visualizadorPdfAberto} onClose={fecharVisualizadorPDF} sx={{ zIndex: 1300 }}>
        <Box sx={{
          backgroundColor: '#1E1E1E',
          p: 3,
          borderRadius: 2,
          width: '90%',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            backgroundColor: '#C7A34F',
            p: 1,
            borderRadius: 1
          }}>
            <Typography variant="h6" sx={{ color: '#1E1E1E', fontWeight: 'bold' }}>
              {livroSelecionado?.titulo || 'Visualizador de PDF'}
            </Typography>
            <IconButton onClick={fecharVisualizadorPDF} sx={{ color: '#1E1E1E' }}>
              <Close />
            </IconButton>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center',
            backgroundColor: '#2A2A2A',
            borderRadius: 1,
            p: 2,
            overflow: 'auto'
          }}>
            {urlPdf ? (
              <iframe 
                src={urlPdf} 
                width="100%" 
                height="100%"
                style={{ border: 'none', borderRadius: '4px' }}
                title="Visualizador de PDF"
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#AAAAAA'
                }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Não foi possível carregar o visualizador de PDF
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => window.open(urlPdf, '_blank')}
                    sx={{ 
                      backgroundColor: '#C7A34F',
                      color: '#1E1E1E',
                      '&:hover': { backgroundColor: '#D7B34F' }
                    }}
                  >
                    Abrir PDF em nova janela
                  </Button>
                </Box>
              </iframe>
            ) : (
              <Typography color="#AAAAAA" sx={{ textAlign: 'center', mt: 4 }}>
                Nenhum PDF disponível para visualização
              </Typography>
            )}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 2,
            gap: 2
          }}>
            <Button
              variant="outlined"
              onClick={() => window.open(urlPdf, '_blank')}
              sx={{ 
                color: '#C7A34F',
                borderColor: '#C7A34F',
                '&:hover': { borderColor: '#D7B34F' }
              }}
            >
              Abrir em Nova Janela
            </Button>
            <Button
              variant="contained"
              onClick={fecharVisualizadorPDF}
              sx={{ 
                backgroundColor: '#C7A34F',
                '&:hover': { backgroundColor: '#D7B34F' }
              }}
            >
              Fechar Visualizador
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog open={modalConfirmacaoAberto} onClose={fecharModalConfirmacao}>
        <Box sx={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}>
          <DialogTitle sx={{ color: '#C7A34F', fontWeight: 'bold' }}>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir o livro "{livroParaDeletar?.titulo}"?
            </Typography>
            <Typography variant="body2" color="#AAAAAA" sx={{ mt: 2 }}>
              Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={fecharModalConfirmacao} 
              disabled={carregando}
              sx={{ color: '#C7A34F', '&:hover': { backgroundColor: 'rgba(199, 163, 79, 0.1)' } }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={deletarLivro} 
              disabled={carregando}
              sx={{
                backgroundColor: '#D32F2F',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#F44336' },
                '&:disabled': { backgroundColor: '#5A5A5A', color: '#9A9A9A' }
              }}
            >
              {carregando ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Confirmar Exclusão'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbarAberto}
        autoHideDuration={6000}
        onClose={fecharSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={fecharSnackbar}
          severity={severidadeSnackbar}
          sx={{ 
            width: '100%',
            backgroundColor: severidadeSnackbar === 'error' ? '#2D0A0A' : 
                            severidadeSnackbar === 'success' ? '#0A2D1A' : '#1A1A2D',
            color: '#FFFFFF'
          }}
        >
          {mensagemSnackbar}
        </Alert>
      </Snackbar>
      <FooterComponent />
    </Box>
  );
};

export default HomeGerenciador;