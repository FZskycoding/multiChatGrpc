import React, { useEffect, useState } from "react";
import "../styles/ChatRoom.css";

function ChatRoom({ username }) {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    //建立一個新的 WebSocket 連線（連到你的後端）
    const socket = new WebSocket("ws://localhost:8080/ws");
    setWs(socket);

    //每次接收到訊息 (onmessage)，就解析內容並加入 messages 狀態。
    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages((prev) => [...prev, messageData]);
    };

    //若 WebSocket 關閉，就印出提示。
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  //傳送訊息
  const sendMessage = () => {
    if (ws && input.trim()) {
      const message = {
        sender: username,
        text: input,
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(message));
      setInput("");
    }
  };

  //支援enter送出
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
          <div
            key={index}
            className={`message-item ${
              msg.sender === username ? "own-message" : "other-message"
            }`}
          >
            {msg.sender !== username && (
              <div className="message-sender">{msg.sender}</div>
            )}
            <div className="message-bubble">
              <div className="message-text">{msg.text}</div>
            </div>
            <span className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
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
        <button className="send-button" onClick={sendMessage}>
          送出訊息
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
