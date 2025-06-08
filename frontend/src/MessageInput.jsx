import { useState } from "react";

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
    <div className="flex">
      <input
        type="text"
        className="flex-1 border p-2 rounded-l"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="輸入訊息..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 rounded-r"
      >
        發送
      </button>
    </div>
  );
}

export default MessageInput;
