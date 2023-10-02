import { useState, useEffect } from "react";

import Styles from "../Relatorio-Placa/styles.module.css";

const RelatorioPlaca = () => {
  const [data, setData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(""); // Adicione um estado para a cidade selecionada

  useEffect(() => {
    fetch("http://localhost:3000/cidades")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  // Função para lidar com a mudança na seleção da cidade
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleButtonClick = () => {
    fetch(`http://localhost:3001/relatorio/cidade/${selectedCity}`)
      .then((response) => response.json())
      .then((data) => {
        // Faça algo com os dados recebidos
      });
  };

  return (
    <div className={Styles.body}>
      <div className={Styles.form}>
        <h1>Relatório por Cidade</h1>
        <br></br>
        <select onChange={handleCityChange}>
          {data?.map((item) => (
            <option key={item.id} value={item.cidade}>
              {item.cidade}
            </option>
          ))}
        </select>
        <br></br>
        <button type="submit" onClick={handleButtonClick}>
          Gerar Relatório
        </button>
      </div>
    </div>
  );
};

export default RelatorioPlaca;
