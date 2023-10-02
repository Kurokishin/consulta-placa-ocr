import { Route, Routes } from "react-router-dom";
import Cadastro from "../pages/Cadastro-Placa/index.jsx";
import RelatorioPlaca from "../pages/Relatorio-Placa/index.jsx";

export const RouteList = () => {
  return (
    <Routes>
      <Route path="/" element={<Cadastro />} />
      <Route path="/relatorio" element={<RelatorioPlaca />} />
    </Routes>
  );
};
