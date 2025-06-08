import React, { useEffect, useState } from "react";
import "../styles/ChatRoom.css";

function ChatRoom({ username }) {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    setWs(socket);

    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages((prev) => [...prev, messageData]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      const message = {
        sender: username,
        text: input,
        timestamp: new Date().toISOString()
      };
      ws.send(JSON.stringify(message));
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">{username}的聊天室</h2>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message-item">
            <strong>{msg.sender}</strong>
            <span className="message-timestamp">
              {new Date(msg.timestamp).toLocaleString()}
            </span>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="輸入訊息"
        />
        <button
          className="send-button"
          onClick={sendMessage}
        >
          送出訊息
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
