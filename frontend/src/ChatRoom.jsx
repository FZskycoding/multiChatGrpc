import React, { useEffect, useState } from "react";

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
    <div>
      <h2>{username}的聊天室</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "10px 0",
              padding: "5px",
              backgroundColor: "#f5f5f5",
              borderRadius: "5px",
            }}
          >
            <strong>{msg.sender}</strong>
            <span
              style={{ color: "#666", fontSize: "0.8em", marginLeft: "10px" }}
            >
              {new Date(msg.timestamp).toLocaleString()}
            </span>
            <div style={{ marginTop: "5px" }}>{msg.text}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="輸入訊息"
          style={{ width: "70%", padding: "5px" }}
        />
        <button
          onClick={sendMessage}
          style={{ marginLeft: "10px", padding: "5px 10px" }}
        >
          送出訊息
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
