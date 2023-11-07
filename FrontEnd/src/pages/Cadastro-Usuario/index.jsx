import { useState } from "react";
import Styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const CadastroUsuario = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMenssage] = useState("");
  const [isError, setIsError] = useState(false);

  const Navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://consulta-placa-ocr.vercel.app/cadastro", {
        email,
        password,
      });

      setMenssage(response.data.message);
      setIsError(false);

      setTimeout(() => {
        Navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Erro no cadastro", error);
      setIsError(true);
      if (error.response) {
        setMenssage(error.response.data.message);
      } else if (error.request) {
        setMenssage(
          "Nenhuma resposta do servidor. Por favor, tente novamente mais tarde."
        );
      } else {
        setMenssage(error.message);
      }
    }
  };

  return (
    <>
      <div className={Styles.body}>
        <div className={isError ? Styles.error_message : Styles.message}>
          <p>{message}</p>
        </div>
        <h1>Cadastro de Usuário</h1>
        <br></br>
        <form onSubmit={handleSubmit}>
          <label>Informe o seu email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
          <br />

          <label>Informe a sua senha</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          <button type="submit">Cadastrar</button>
          <br />

          <Link to={"/"}>
            <button>Voltar</button>
          </Link>
        </form>
      </div>
    </>
  );
};

export default CadastroUsuario;
