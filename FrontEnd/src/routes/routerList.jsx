import { Route, Routes } from "react-router-dom";
import Cadastro from "../pages/Cadastro-Placa/index.jsx";
import RelatorioPlaca from "../pages/Relatorio-Placa/index.jsx";
import ConsultaPlaca from "../pages/Consulta-Placa/index.jsx";

export const RouteList = () => {
  return (
    <Routes>
      <Route path="/" element={<Cadastro />} />
      <Route path="/relatorio" element={<RelatorioPlaca />} />
      <Route path="/consulta" element={<ConsultaPlaca />} />
    </Routes>
  );
};
