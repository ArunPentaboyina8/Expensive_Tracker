import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  return (
    <div className="chat-page">
      <div className="page-header">
        <h1>AI Finance Assistant</h1>
        <p className="page-subtitle">Ask questions about your spending habits</p>
      </div>
      <ChatWindow />
    </div>
  );
}
