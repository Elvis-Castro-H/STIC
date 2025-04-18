import { useState, useEffect, useRef } from 'react';
import { RiRobot2Line } from 'react-icons/ri';
import { sendMessageToChatbot } from '@/app/services/ChatbotService';
import { marked } from 'marked';
import '../../styles/floatingChat.css';

type Message = {
  type: 'bot' | 'user';
  text: string;
  time: string;
};

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const mensajeInicial: Message = {
        type: 'bot',
        text: '¡Hola! ¿En qué puedo ayudarte hoy?',
        time: hora,
      };
      setMessages([mensajeInicial]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      type: 'user',
      text: input,
      time: hora,
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');

    try {
      const botResponses = await sendMessageToChatbot('usuario1', userInput);

      const botMessages: Message[] = botResponses.map(res => ({
        type: 'bot',
        text: res.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      setMessages(prev => [...prev, ...botMessages]);
    } catch (error) {
      console.error('Error comunicándose con el bot:', error);
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: 'Hubo un problema al contactar al bot. Intenta de nuevo.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <button
        className="floating-cart"
        onClick={toggleChat}
        style={{ backgroundColor: isOpen ? '#f0eeed' : '#d40813', color: isOpen ? '#d40813' : 'white' }}
      >
        {isOpen ? '▼' : <RiRobot2Line size={24} />}
      </button>

      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <RiRobot2Line size={20} />
            <span className="chat-title">STIC</span>
            <button className="close-chat" onClick={toggleChat}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'bot' && <div className="avatar"><RiRobot2Line /></div>}
                <div className={`bubble ${msg.type === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
                  {msg.type === 'bot' ? (
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="time">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Escribe tu mensaje aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
