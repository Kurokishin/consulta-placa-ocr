import { Route, Routes } from "react-router-dom";
import CadastroPlaca from "../pages/Cadastro-Placa/index.jsx";
import RelatorioPlaca from "../pages/Relatorio-Placa/index.jsx";
import ConsultaPlaca from "../pages/Consulta-Placa/index.jsx";
import CadastroUsuario from "../pages/Cadastro-Usuario/index.jsx";
import LoginUsuario from "../pages/Login-Usuario/index.jsx";
import Alerta from "../pages/Alerta-Route/alerta.jsx";

export const RouteList = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginUsuario />} />
      <Route path="/cadastroUsuario" element={<CadastroUsuario />} />
      <Route path="/cadadastroPlaca" element={<CadastroPlaca />} />
      <Route path="/relatorio" element={<RelatorioPlaca />} />
      <Route path="/consulta" element={<ConsultaPlaca />} />
      <Route path="/alerta" element={<Alerta />} />
    </Routes>
  );
};
