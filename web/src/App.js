import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/reset.css';
import { makeRequest } from './api/api';
import { SideMenu } from './components/SideMenu/SideMenu';
import { ChatMessage } from './components/ChatMessage/ChatMessage';

const initialTip = "Olá! Sou um especialista em QA (Garantia de Qualidade) com várias certificações. Deseja alguma dica de qualidade?";

function App() {
  const [input, setInput] = useState("");
  const [chatlog, setChatLog] = useState([]);

  useEffect(() => {
    // Exibir a mensagem inicial quando o componente for montado
    setChatLog([
      ...chatlog,
      { user: 'gpt', message: initialTip }
    ]);
  }, []); // Executar este efeito apenas uma vez, quando o componente for montado

  async function getQATip() {
    const tips = [
      "Lembre-se de testar não apenas as funcionalidades principais, mas também os casos de uso menos comuns e cenários de borda.",
      "Automatize seus testes sempre que possível para economizar tempo e reduzir erros humanos.",
      "Use técnicas de teste exploratório para descobrir defeitos que podem não ser encontrados por testes automatizados."
      // Adicione mais dicas conforme necessário
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let response = [];
    
    if (input.toLowerCase().includes("dica")) {
      response = await getQATip();
      setChatLog([
        ...chatlog,
        { user: 'me', message: input },
        { user: 'gpt', message: response },
        { user: 'gpt', message: "Você deseja outra dica?" }
      ]);
    } else if (input.toLowerCase().includes("sim")) {
      response = await getQATip();
      setChatLog([
        ...chatlog,
        { user: 'me', message: input },
        { user: 'gpt', message: response },
        { user: 'gpt', message: "Você deseja outra dica?" }
      ]);
    } else if (input.toLowerCase().includes("não")) {
      response = "Ok, estou aqui se você precisar de mais alguma coisa!";
      setChatLog([
        ...chatlog,
        { user: 'me', message: input },
        { user: 'gpt', message: response }
      ]);
    } else {
      response = await makeRequest({ prompt: input });
      response = response.data.split("\n").map(line => <p>{line}</p>);
      setChatLog([
        ...chatlog,
        { user: 'me', message: input },
        { user: 'gpt', message: response }
      ]);
    }
    
    setInput("");
  }

  return (
    <div className="App">
      <SideMenu />
      <section className="chatbox">
        <div className="chat-log">
          {chatlog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows='1'
              className='chat-input-textarea'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
