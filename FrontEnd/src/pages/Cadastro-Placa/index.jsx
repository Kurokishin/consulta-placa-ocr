import { useState } from "react";
import axios from "axios";
import Styles from "../Cadastro-Placa/styles.module.css";

const CadastroPlaca = () => {
  const [file, setFile] = useState(null);
  const [cidade, setCidade] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("cidade", cidade);

    try {
      const response = await axios.post(
        "http://localhost:3000/cadastroPlaca",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Erro durante o cadastro:", error);
    }
  };
  return (
    <div className={Styles.body}>
      <h1>Envio de Placa</h1>
      <form onSubmit={handleSubmit}>
        <label for="file">Imagem da Placa (PNG apenas):</label>
        <input
          type="file"
          accept="image/png"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />

        <label for="cidade">Nome da Cidade:</label>
        <input
          type="text"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />
        <br />

        <input type="submit" value="Enviar" />
      </form>
    </div>
  );
};

export default CadastroPlaca;
