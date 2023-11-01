import { useState } from "react";
import Styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginUsuario = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMenssage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isCadastroSucesso, setIsCadastroSucesso] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      if (response.data.logged) {
        localStorage.setItem("token", response.data.token);
        navigate("/cadadastroPlaca");
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Erro no login", error);
    }
  };

  return (
    <div className={Styles.body}>
      <div className={isError ? Styles.error_message : Styles.message}>
        <p>{message}</p>
      </div>
      <h1>Login de Usuário</h1>
      <br></br>
      <form onSubmit={handleSubmit}>
        <label>Informe o seu email</label>
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <br />

        <label>Informe a sua senha</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <br />

        <div className={Styles.buttons}>
          <button type="submit">Login</button>
        </div>

        <Link to={"/cadastroUsuario"}>
          <button>Cadastro</button>
        </Link>
      </form>
    </div>
  );
};

export default LoginUsuario;
