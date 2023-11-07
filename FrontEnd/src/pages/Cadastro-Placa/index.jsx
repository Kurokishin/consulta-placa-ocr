import { useState, useEffect, useRef } from "react";
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

  const formRef = useRef();

  const { data, setData, saveData } = useSaveData(
    "https://consulta-placa-ocr.vercel.app/cidades"
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
          "https://consulta-placa-ocr.vercel.app/cadastroPlaca",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
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
      setIsError(false);
      setMenssage("Cadastro realizado com sucesso");
      setIsCadastroSucesso(true);

      setFile(null);
      setCidade("");

      const response = await axios.get("https://consulta-placa-ocr.vercel.app/cidades");
      const cidadeExiste = response.data.some(
        (cidade) =>
          cidade.cidade.trim().toLowerCase() ===
          data.cidade.trim().toLowerCase()
      );

      if (!cidadeExiste) {
        saveData();
      }

      formRef.current.reset();
    } catch (error) {
      setIsError(true);
      setMenssage("Erro durante o cadastro");
    }
  };

  useEffect(() => {
    axios
      .get("https://consulta-placa-ocr.vercel.app/cidades")
      .then(function (response) {
        if (response.data.length > 0) {
          setIsCadastroSucesso(true);
        } else {
          setIsCadastroSucesso(false);
        }
      })
      .catch(function (error) {
        setIsCadastroSucesso(false);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMenssage("");
    }, 2000);
  }, [message]);

  return (
    <div className={Styles.body}>
      <div className={isError ? Styles.error_message : Styles.message}>
        <p>{message}</p>
      </div>
      <h1>Envio de Placa</h1>
      <br></br>
      <form ref={formRef} onSubmit={combinedFormSubmissionHandler}>
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

          <Link to={"/"}>
            <button>Sair</button>
          </Link>
        </div>
      </form>

      <div className={Styles.containerButtons}>
        <Link to={"/consulta"}>
          <button>Consultar Placas</button>
        </Link>

        <Link
          to={"/relatorio"}
          className={isCadastroSucesso ? Styles.block : Styles.none}
        >
          <button>Relatorio Placas</button>
        </Link>
      </div>
    </div>
  );
};

export default CadastroPlaca;
