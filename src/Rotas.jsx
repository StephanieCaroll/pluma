import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from './views/home/Home';
import FormLogin from './views/login/FormLogin';
import FormCadastro from "./views/login/FormCadastro";
import Carrinho from "./views/compras/Carrinho";
import ListProduto from "./views/produto/ListProduto";
import FormProduto from "./views/produto/FormProduto";
import Perfil from "./views/login/Perfil";
import Favoritos from "./views/favoritos/Favoritos";
import ResetPassword from "./views/login/ResetPassword";

function Rotas() { 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list-cliente" element={<div>Página de Clientes</div>} />
      <Route path="/list-produto" element={<ListProduto />} />
      <Route path="/form-login" element={<FormLogin />} />
      <Route path="/form-cadastro" element={<FormCadastro />} />
      <Route path="/form-produto" element={<FormProduto />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/carrinho" element={ <Carrinho />} />
      <Route path="/favoritos" element={ <Favoritos />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default Rotas;
