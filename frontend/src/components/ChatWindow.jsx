import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import API from '../api';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 Hello! I\'m your Finance Assistant. Ask me about your spending!\n\nTry:\n• "Where am I spending most?"\n• "How much have I spent?"\n• "Give me saving tips"\n• "Show category breakdown"',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/chat', { message: text });
      setMessages((prev) => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-window__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
            <div className="chat-msg__avatar">
              {msg.role === 'bot' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="chat-msg__bubble">
              {msg.text.split('\n').map((line, j) => (
                <span key={j}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg chat-msg--bot">
            <div className="chat-msg__avatar">
              <Bot size={18} />
            </div>
            <div className="chat-msg__bubble chat-msg__typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-window__input">
        <input
          type="text"
          placeholder="Ask about your spending..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          id="chat-input"
        />
        <button
          className="btn btn--primary btn--icon"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          id="chat-send-btn"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
