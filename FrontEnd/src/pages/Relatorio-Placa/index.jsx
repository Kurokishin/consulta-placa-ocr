import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Styles from "../Relatorio-Placa/styles.module.css";

const RelatorioPlaca = () => {
  const [data, setData] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/cidades")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setSelectedCity(data[0]?.cidade);
      })
      .catch((error) => console.error(error));
  }, []);

  // Função para lidar com a mudança na seleção da cidade
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleButtonClick = () => {
    window.open(
      `http://localhost:3001/relatorio/cidade/${selectedCity}`,
      "_blank"
    );
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

        <div className={Styles.buttons}>
          <button type="submit" onClick={handleButtonClick}>
            Gerar Relatório
          </button>

          <Link to={"/"}>
            <button>Voltar</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatorioPlaca;
