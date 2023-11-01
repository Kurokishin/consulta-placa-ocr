import { useState } from "react";
import axios from "axios";
import styles from "../Consulta-Placa/styles.module.css";
import { Link } from "react-router-dom";

function ConsultaPlaca() {
  const [placa, setPlaca] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [existe, setExiste] = useState(null);

  const consultarPlaca = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/consulta/${placa}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { mensagem, existe } = response.data;

      setMensagem(mensagem);
      setExiste(existe);
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao consultar a placa");
      setExiste(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Consulta de Placa</h1>
      <div>
        <label>Digite a placa:</label>
        <input
          type="text"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
        />
        <div>
          <button onClick={consultarPlaca}>Consultar</button>

          <Link to={"/"}>
            <button className={styles.buttons}>Voltar</button>
          </Link>
        </div>
      </div>

      {existe !== null && (
        <p className={existe ? styles.message : styles.error_message}>
          A placa {existe ? "existe" : "não existe"} no banco de dados
        </p>
      )}
    </div>
  );
}

export default ConsultaPlaca;
