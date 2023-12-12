import { useState, useEffect } from "react";
import Styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL_TEMP = "https://api.thingspeak.com/channels/2374597/field/1.json";
const API_URL_UMI = "https://api.thingspeak.com/channels/2374597/field/2.json";

const LoginUsuario = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMenssage] = useState("");
  const [isError, setIsError] = useState(false);

  const [tempData, setTempData] = useState(null);
  const [umiData, setUmiData] = useState(null);

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
        navigate("/cadastroPlaca");
      } else {
        setIsError(true);
        setMenssage(response.data.message);
      }
    } catch (error) {
      console.error("Erro no login", error);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempResponse = await fetch(API_URL_TEMP);
        const tempData = await tempResponse.json();
        const lastTempEntry = tempData.feeds[tempData.feeds.length - 1];
        setTempData(lastTempEntry);

        const umiResponse = await fetch(API_URL_UMI);
        const umiData = await umiResponse.json();
        const lastUmiEntry = umiData.feeds[umiData.feeds.length - 1];
        setUmiData(lastUmiEntry);
      } catch (error) {
        console.error("Erro ao buscar dados das APIs:", error);
      }
    };

    fetchData();
  }, []);

  console.log("tempData", tempData);
  console.log("umiData", umiData);

  return (
    <div className={Styles.body}>
      <div className={isError ? Styles.error_message : Styles.message}>
        <p>{message}</p>
      </div>
      <h1>Login de Usuário</h1>
      <br></br>

      <div className={Styles.divTemp}>
        {tempData && (
          <div>
            <p>Temperatura: {parseFloat(tempData.field1).toFixed(2)}</p>
          </div>
        )}

        {umiData && (
          <div>
            <p>Umidade: {parseFloat(umiData.field2).toFixed(2)}</p>
          </div>
        )}
      </div>

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
