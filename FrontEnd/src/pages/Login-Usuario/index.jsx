import { useState } from "react";
import Styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { useSaveData } from "../../hooks/use-saveDate";

const LoginUsuario = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMenssage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isCadastroSucesso, setIsCadastroSucesso] = useState(false);

  const { data, setData, saveData } = useSaveData(
    "http://localhost:3000/cidades"
  );

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailExists = await checkEmail(email);
    if (emailExists) {
      console.log("Já existe um cadastro com esse email");
      return;
    }

    // Continuar com o cadastro...
    const response = await fetch("http://localhost:3001/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.message) {
      console.log(data.message);
    } else {
      console.error("Erro no cadastro");
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

        <label>Informe o seu login</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <br />

        <div className={Styles.buttons}>
          <button type="submit">Login</button>
        </div>

        <Link to={"/consulta"}>
          <button>Cadastro</button>
        </Link>
      </form>
    </div>
  );
};

export default LoginUsuario;
