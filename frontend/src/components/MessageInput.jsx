import { useState } from "react";
import "../styles/MessageInput.css";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        className="message-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="輸入訊息..."
      />
      <button
        onClick={handleSend}
        className="send-button"
      >
        發送
      </button>
    </div>
  );
}

export default MessageInput;
