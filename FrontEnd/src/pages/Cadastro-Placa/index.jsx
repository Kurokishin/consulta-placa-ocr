import { useState } from "react";
import axios from "axios";
import Styles from "../Cadastro-Placa/styles.module.css";
import { Link } from "react-router-dom";
import { useSaveData } from "../../hooks/use-saveDate";
import { v4 as uuidv4 } from "uuid";

const CadastroPlaca = () => {
  const [file, setFile] = useState(null);
  const [cidade, setCidade] = useState("");

  const { data, setData, saveData } = useSaveData(
    "http://localhost:3000/cidades"
  );

  const combinedJobChangeHandler = (e) => {
    setCidade(e.target.value);
    setData({ ...data, cidade: e.target.value, id: uuidv4() });
  };

  const handleSubmit = () => {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("cidade", cidade);

      try {
        const response = await axios.post(
          "http://localhost:3001/cadastroPlaca",
          formData
        );
        console.log(response.data);
        resolve(response.data);
      } catch (error) {
        console.error("Erro durante o cadastro:", error);
        reject(error);
      }
    });
  };

  const combinedFormSubmissionHandler = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit();
    } catch (error) {
      console.error("Erro durante o cadastro:", error);
    } finally {
      saveData();
    }
  };

  return (
    <div className={Styles.body}>
      <h1>Envio de Placa</h1>
      <form onSubmit={combinedFormSubmissionHandler}>
        <label for="file">Imagem da Placa (PNG apenas):</label>
        <input
          type="file"
          accept="image/png"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />

        <label for="cidade">Nome da Cidade:</label>
        <input type="text" value={cidade} onChange={combinedJobChangeHandler} />
        <br />

        <button type="submit">Enviar</button>
      </form>

      <div className={Styles.containerButtons}>
        <Link to={"/consulta"}>
          <button>Consultar Placas</button>
        </Link>

        <Link to={"/relatorio"}>
          <button>Relatorio Placas</button>
        </Link>
      </div>
    </div>
  );
};

export default CadastroPlaca;
