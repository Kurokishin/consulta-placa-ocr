import { useState, useEffect } from "react";
import socketIOClient from 'socket.io-client';
import styles from './styles.module.css';

const Alerta = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const socket = socketIOClient('http://localhost:5870');

  useEffect(() => {
    socket.on('alerta', (mensagem) => {
      setAlertMessage(mensagem);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const enviarAlerta = async () => {
    const mensagem = 'Inconsistência de dados ou equipamentos foram detectados no sistema';

    try {
      const response = await fetch('http://localhost:5870/alerta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensagem }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.error('Falha ao enviar alerta');
      }
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Alerta</h1>
      <button onClick={enviarAlerta}>Enviar Alerta</button>
      <p>Último alerta recebido: {alertMessage}</p>
    </div>
  );
};

export default Alerta;
