import { useState } from 'react';
import axios from 'axios';
import styles from '../Consulta-Placa/styles.module.css'; // Importando os estilos

function ConsultaPlaca() {
  const [placa, setPlaca] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [existe, setExiste] = useState(null);

  const consultarPlaca = async () => {
    try {
      const response = await axios.get(`/consulta/${placa}`);
      const { mensagem, existe } = response.data;

      setMensagem(mensagem);
      setExiste(existe);
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao consultar a placa');
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
        <button onClick={consultarPlaca}>Consultar</button>
      </div>
      {mensagem && <p>{mensagem}</p>}
      {existe !== null && (
        <p>A placa {existe ? 'existe' : 'não existe'} no banco de dados</p>
      )}
    </div>
  );
}

export default ConsultaPlaca;
