import { useState } from "react";
import axios from "axios";
import Styles from "../Cadastro-Placa/styles.module.css";
import { Link } from "react-router-dom";
import { useSaveData } from "../../hooks/use-saveDate";
import { v4 as uuidv4 } from "uuid";

const CadastroPlaca = () => {
  const [file, setFile] = useState(null);
  const [cidade, setCidade] = useState("");
  const [message, setMenssage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isCadastroSucesso, setIsCadastroSucesso] = useState(false);

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
      setIsError(false); // Não é um erro
      setMenssage("Cadastro realizado com sucesso");
      setIsCadastroSucesso(true); // Ativa os botões
      setTimeout(() => {
        setMenssage(""); // Limpa a mensagem após 5 segundos
      }, 5000);
    } catch (error) {
      setIsError(true); // É um erro
      setMenssage("Erro durante o cadastro");
      setTimeout(() => {
        setMenssage(""); // Limpa a mensagem após 5 segundos
      }, 5000);
    } finally {
      saveData();
    }
  };

  return (
    <div className={Styles.body}>
      <div className={isError ? Styles.error_message : Styles.message}>
        <p>{message}</p>
      </div>
      <h1>Envio de Placa</h1>
      <br></br>
      <form onSubmit={combinedFormSubmissionHandler}>
        <label htmlFor="file">Imagem da Placa (PNG apenas):</label>
        <input
          type="file"
          accept="image/png"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />

        <label htmlFor="cidade">Nome da Cidade:</label>
        <input type="text" value={cidade} onChange={combinedJobChangeHandler} />
        <br />

        <div className={Styles.buttons}>
          <button type="submit">Enviar</button>
        </div>
      </form>

      <div className={Styles.containerButtons}>
        <Link to={"/consulta"}>
          <button disabled={!isCadastroSucesso}>Consultar Placas</button>
        </Link>

        <Link to={"/relatorio"}>
          <button disabled={!isCadastroSucesso}>Relatorio Placas</button>
        </Link>
      </div>
    </div>
  );
};

export default CadastroPlaca;
