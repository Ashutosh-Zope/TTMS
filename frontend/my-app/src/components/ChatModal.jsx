// src/components/ChatModal.jsx
import React, { useEffect, useRef, useState } from "react";

const API_BASE = "http://localhost:5001/api";

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const chatBoxRef = useRef(null);

  const chatKey = `chat-general`; // 🆕 General chat session key

  useEffect(() => {
    const savedChat = sessionStorage.getItem(chatKey);
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      const welcomeMsg = [{
        sender: "ai",
        text: `👋 Hello! I'm your AI Assistant. Feel free to ask me anything.`,
      }];
      setMessages(welcomeMsg);
      sessionStorage.setItem(chatKey, JSON.stringify(welcomeMsg));
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const saveMessages = (updatedMessages) => {
    setMessages(updatedMessages);
    sessionStorage.setItem(chatKey, JSON.stringify(updatedMessages));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { sender: "user", text: input }];
    saveMessages(updatedMessages);

    try {
      const res = await fetch(`${API_BASE}/ask-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }), // 🆕 Just send user question now
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      if (data.reply) {
        saveMessages([...updatedMessages, { sender: "ai", text: data.reply }]);
      } else {
        saveMessages([...updatedMessages, { sender: "ai", text: "No reply from AI." }]);
      }
    } catch (error) {
      console.error("Error talking to AI:", error.message);
      saveMessages([...updatedMessages, { sender: "ai", text: `Error: ${error.message}` }]);
    }

    setInput("");
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ background: "rgba(0,0,0,0.4)" }}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "15px",
          maxWidth: "600px",
          width: "90%",
          margin: "auto",
          marginTop: "5%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          height: "80vh",
        }}
      >
        <button className="close-btn" onClick={onClose} style={{
          position: "absolute",
          top: "1rem",
          right: "1.5rem",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer"
        }}>
          ×
        </button>

        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Ask AI Assistant
        </h2>

        {/* Chat Messages Scroll Area */}
        <div
          ref={chatBoxRef}
          className="chat-box"
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "1rem",
            background: "#f9f9f9",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                margin: "0.5rem 0",
              }}
            >
              <span style={{
                background: msg.sender === "user" ? "#DCF8C6" : "#e0e7ff",
                padding: "0.75rem 1rem",
                borderRadius: "20px",
                maxWidth: "70%",
                fontSize: "0.95rem",
                wordBreak: "break-word",
              }}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Fixed Input and Send Button */}
        <div className="chat-input" style={{ display: "flex" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            style={{
              flexGrow: 1,
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "20px",
              border: "1px solid #ccc",
              marginRight: "0.5rem",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "20px",
              backgroundColor: "#7f5af0",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
