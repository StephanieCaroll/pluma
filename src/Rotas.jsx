import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from './views/home/Home';
import HomeGerenciador from './views/home/HomeGerenciador';
import FormLogin from './views/login/FormLogin';
import FormCadastro from "./views/login/FormCadastro";
import Carrinho from "./views/compras/Carrinho";
import ListProduto from "./views/produto/ListProduto";

function Rotas() { 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list-cliente" element={<div>Página de Clientes</div>} />
      <Route path="/list-produto" element={<ListProduto />} />
      <Route path="/form-login" element={<FormLogin />} />
      <Route path="/form-cadastro" element={<FormCadastro />} />
      <Route path="/carrinho" element={ <Carrinho />} />
      <Route path="/homeGerenciador" element={ <HomeGerenciador />} />
    </Routes>
  );
}

export default Rotas;
