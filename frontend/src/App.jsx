import React, { useState } from "react";
import ChatRoom from "./ChatRoom";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [entered, setEntered] = useState(false);

  //entered是true的時候就顯示聊天室，反之就顯示表單
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setEntered(true);
    }
  };

  return (
    <div className="app-container">
      {!entered ? (
        <form onSubmit={handleSubmit} className="login-form">
          <h2>請輸入您的名稱</h2>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="輸入名稱"
            />
            <button type="submit">
              送出
            </button>
          </div>
        </form>
      ) : (
        <ChatRoom username={username} />
      )}
    </div>
  );
}

export default App;
