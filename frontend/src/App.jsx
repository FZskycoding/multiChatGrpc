import React, { useState } from "react";
import ChatRoom from "./ChatRoom";

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
    <div style={{ padding: "20px" }}>
      {!entered ? (
        <form onSubmit={handleSubmit}>
          <h2>請輸入您的名稱</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="輸入名稱"
          />
          <button type="submit" style={{ marginLeft: "10px" }}>
            送出
          </button>
        </form>
      ) : (
        <ChatRoom username={username} />
      )}
    </div>
  );
}

export default App;
