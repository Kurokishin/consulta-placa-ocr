import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Styles from "../Relatorio-Placa/styles.module.css";

const RelatorioPlaca = () => {
  const [data, setData] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetch("https://consulta-placa-ocr.vercel.app/cidades")
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
    axios
      .get(`https://consulta-placa-ocr.vercel.app/relatorio/cidade/${selectedCity}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob", // Indica que a resposta será um blob
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); // ou qualquer outro nome de arquivo
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error(error));
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

          <Link to={"/cadastroPlaca"}>
            <button>Voltar</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatorioPlaca;
