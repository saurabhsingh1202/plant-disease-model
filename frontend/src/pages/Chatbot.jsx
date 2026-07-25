import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/LanguageContext';
import { Send, Bot, User, HelpCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Chatbot() {
  const { t, lang } = useTranslation();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: lang === 'hi' 
        ? "नमस्ते! मैं आपका कृषि सहायक हूँ। मैं फसलों की बीमारी, खाद, सिंचाई, मौसम या सरकारी योजनाओं के बारे में आपके प्रश्नों का उत्तर दे सकता हूँ। आज आप क्या जानना चाहते हैं?"
        : lang === 'bho'
        ? "राम राम! हम रउवा खेती-बारी सहायक हईं। पौधा के बीमारी, खाद, पानी, मौसम भा सरकारी योजना के बारे में कुछ भी पूछीं।"
        : lang === 'mr'
        ? "नमस्कार! मी आपला शेती सहाय्यक आहे. पीक रोग, खते, पाणी किंवा सरकारी योजनांबद्दल मला विचारा."
        : lang === 'ta'
        ? "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். பயிர் நோய்கள், உரங்கள், அரசு திட்டங்கள் பற்றி கேளுங்கள்."
        : "Hello! I am your Smart Farmer Assistant. Ask me anything about crop diseases, fertilizers, irrigation, weather, or government schemes. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = lang === 'hi' ? [
    "टमाटर की पत्तियां पीली क्यों हो रही हैं?",
    "गेहूं में पहला पानी कब देना चाहिए?",
    "पीएम किसान योजना क्या है?",
    "काली मिट्टी में कौन सी फसलें बोएं?"
  ] : lang === 'bho' ? [
    "टमाटर के पत्ता पियर काहे होता?",
    "गेहूं में पहिला पानी कब देवे के चाही?",
    "पीएम किसान योजना का ह?",
    "कारी मट्टी में कौन फसल होई?"
  ] : lang === 'mr' ? [
    "टोमॅटोची पाने पिवळी का पडत आहेत?",
    "गव्हाला पहिले पाणी कधी द्यावे?",
    "पीएम किसान योजना काय आहे?",
    "काळ्या मातीत कोणती पिके घ्यावीत?"
  ] : lang === 'ta' ? [
    "தக்காளி இலைகள் ஏன் மஞ்சள் நிறமாகின்றன?",
    "கோதுமைக்கு முதல் நீர் எப்போது பாய்ச்ச வேண்டும்?",
    "பிஎம் கிசான் திட்டம் என்றால் என்ன?",
    "கரிசல் மண்ணில் என்ன பயிர் செய்யலாம்?"
  ] : [
    "Why are my tomato leaves turning yellow?",
    "When should I irrigate wheat?",
    "What is the PM Kisan Scheme?",
    "Which crops grow best in Black Soil?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) {
      setInput('');
    }

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Map frontend messages history to chat format for backend
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data } = await axios.post(`${API_BASE}/assistant/chatbot`, {
        message: text,
        history: historyPayload
      });

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error('Failed to get response from assistant.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "⚠️ I encountered an error communicating with the AI service. Please make sure the backend server is running and the Mistral API Key is configured." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Convert markdown-like syntax to React elements safely
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold matches
      let formattedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      const elements = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        const textBefore = line.substring(lastIndex, match.index);
        const boldText = match[1];
        
        if (textBefore) elements.push(textBefore);
        elements.push(<strong key={match.index}>{boldText}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      const remainingText = line.substring(lastIndex);
      if (remainingText) elements.push(remainingText);

      // Render lists
      if (line.trim().startsWith('- ')) {
        return (
          <li key={i} style={{ marginLeft: '20px', marginBottom: '6px', listStyleType: 'disc' }}>
            {elements.length > 0 ? elements.slice(1) : line.substring(2)}
          </li>
        );
      }

      return (
        <p key={i} style={{ marginBottom: line.trim() === '' ? '12px' : '6px', minHeight: '1em' }}>
          {elements.length > 0 ? elements : line}
        </p>
      );
    });
  };

  return (
    <div className="container" style={{ maxWidth: 800, paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24, textAlign: 'center' }}>
        <div className="section-label" style={{ margin: '0 auto 8px' }}><Bot size={13} /> Farmer AI</div>
        <h1 className="section-title">{t('chatbotTitle')}</h1>
        <p className="page-subtitle">Expert agricultural chat assistant powered by Mistral AI</p>
      </div>

      {/* Chat Container */}
      <div className="card" style={{ height: 500, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Messages Screen */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: 'rgba(10, 15, 30, 0.2)' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 20,
                gap: 12
              }}
            >
              {m.role !== 'user' && (
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%', 
                  background: 'var(--green-glow)', 
                  border: '1px solid var(--border-green)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={16} style={{ color: 'var(--green-400)' }} />
                </div>
              )}

              <div style={{ 
                maxWidth: '75%', 
                padding: '12px 18px', 
                borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                background: m.role === 'user' ? 'var(--green-glow)' : 'var(--bg-secondary)',
                border: m.role === 'user' ? '1px solid var(--border-green)' : '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: 14,
                lineHeight: 1.6
              }}>
                {formatText(m.content)}
              </div>

              {m.role === 'user' && (
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid var(--border)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={16} style={{ color: 'var(--text-secondary)' }} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                background: 'var(--green-glow)', 
                border: '1px solid var(--border-green)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Bot size={16} style={{ color: 'var(--green-400)' }} />
              </div>
              <div style={{ 
                padding: '12px 20px', 
                borderRadius: '18px 18px 18px 2px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span className="dot-pulse"></span>
                <span className="dot-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="dot-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Panel / Input */}
        <div style={{ padding: 18, borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          {/* Quick Prompts */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 12 }}>
            {quickPrompts.map((qp, i) => (
              <button 
                key={i} 
                className="btn btn-ghost" 
                onClick={() => handleSend(qp)}
                style={{ 
                  fontSize: 12, 
                  whiteSpace: 'nowrap', 
                  padding: '6px 12px',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
                disabled={loading}
              >
                <HelpCircle size={12} />
                {qp}
              </button>
            ))}
          </div>

          {/* Typing Area */}
          <div style={{ display: 'flex', gap: 12 }}>
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('chatbotPlaceholder')}
              style={{ 
                flex: 1, 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border)', 
                borderRadius: 12, 
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: 14,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              disabled={loading}
            />
            <button 
              className="btn btn-primary" 
              onClick={() => handleSend()}
              style={{ borderRadius: 12, width: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
