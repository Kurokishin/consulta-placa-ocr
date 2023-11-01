import { useState } from "react";
import Styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const CadastroUsuario = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMenssage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isCadastroSucesso, setIsCadastroSucesso] = useState(false);

  const Navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/cadastro", {
        email,
        password,
      });

      console.log(response.data.message);
      Navigate("/");
    } catch (error) {
      console.error("Erro no cadastro", error);
    }
  };

  return (
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
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <br />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroUsuario;
