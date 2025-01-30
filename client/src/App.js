import "./normal.css";
import "./App.css";
import { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [models, setModels] = useState([]);
  const [currModel, setCurrModel] = useState("gpt-3.5-turbo-1106");

  useEffect(() => {
    getEngines();
  }, []);

  function clearChat() {
    setChatLog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let newChatLog = [...chatLog, { user: "me", message: `${input}` }];
    await setInput("");
    setChatLog(newChatLog);

    const messages = JSON.stringify({
      message: newChatLog.map((message) => message.message).join("\n"),
    });

    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currModel: currModel,
      }),
    });
    const data = await response.json();
    setChatLog([...newChatLog, { user: "gpt", message: data.message }]);
    console.log(data.message);
  }

  function getEngines() {
    fetch("http://localhost:5000/models")
      .then((response) => response.json())
      .then((data) => setModels(data.data));
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="models">
          <select onChange={(e) => setCurrModel(e.target.value)}>
            {models.map((model, index) => (
              <option key={model.id} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything"
              className="chat-input-textarea"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
