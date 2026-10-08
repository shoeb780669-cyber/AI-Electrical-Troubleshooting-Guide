import React, { useState, useRef, useEffect } from 'react';
import { KPIStats, WastageIssue, CategoryBreakdown, ChatMessage } from '../types/energy';
import { queryEnergyIQAI } from '../services/analyticsEngine';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface AskEnergyIQChatProps {
  stats: KPIStats;
  issues: WastageIssue[];
  categories: CategoryBreakdown[];
  currencySymbol?: string;
}

const SUGGESTED_QUESTIONS = [
  'Why is my electricity cost high?',
  'Where is most energy being consumed?',
  'What is causing the wastage?',
  'Which category should I focus on first?',
  'How can I reduce my monthly bill?',
  'What happened during after-hours?',
  'What would happen if consumption decreased by 20%?',
  'Which recommendation has the highest potential impact?',
];

export const AskEnergyIQChat: React.FC<AskEnergyIQChatProps> = ({
  stats,
  issues,
  categories,
  currencySymbol = '₹',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **EnergyIQ AI**, your dedicated Business Analytics and Energy Intelligence Assistant.\n\nI have analysed your **${stats.totalKwh.toLocaleString()} kWh** dataset and identified **${stats.potentialWastageKwh} kWh** in preventable wastage. Ask me any strategic or operational question about your electricity bills, equipment inefficiencies, or savings roadmaps below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Local Analytics Engine',
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText: string) => {
    const text = questionText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await queryEnergyIQAI(text, stats, issues, categories, currencySymbol);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `Based on local analytics, your facility consumed **${stats.totalKwh} kWh** incurring **${currencySymbol}${stats.totalCost}**, with **${stats.potentialWastageCost}** in preventable after-hours leakage.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Local Analytics Engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Ask EnergyIQ AI</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
                Hybrid Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Natural Language Decision Support & Diagnostic Queries
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'reset',
                sender: 'assistant',
                text: 'Conversation reset. How can I assist your energy analysis?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                source: 'Local Analytics Engine',
              },
            ])
          }
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 font-mono"
          title="Reset Chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Suggested Questions Carousel / Chip Cloud */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-thin">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="shrink-0 px-2.5 py-1 text-[11px] rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer font-medium hover:border-cyan-500/40"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-md'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-bl-sm shadow-inner'
                }`}
              >
                {/* Source & Timestamp */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-mono">
                  <span>{isUser ? 'You' : 'EnergyIQ Business Intelligence'}</span>
                  <div className="flex items-center gap-2">
                    {msg.source && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400">
                        {msg.source}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Message Body with markdown bold and bullet parsing */}
                <div className="space-y-1.5 whitespace-pre-wrap font-sans">
                  {msg.text.split('\n').map((line, i) => {
                    // Simple bold replacement
                    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <div
                        key={i}
                        dangerouslySetInnerHTML={{ __html: formatted }}
                        className={line.startsWith('- ') || line.startsWith('* ') ? 'pl-3' : ''}
                      />
                    );
                  })}
                </div>

                {/* Copy action on assistant message */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Grounded in monitored dataset
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-950/90 text-slate-300 border border-slate-800 rounded-2xl rounded-bl-sm p-4 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing consumption patterns & calculating tariff metrics...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about costs, wastage, or optimization..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <span className="text-[10px] text-slate-500 font-mono mt-1.5 block text-center">
          Zero-cost local heuristic reasoning active • Optional Gemini AI enabled if API key present
        </span>
      </div>
    </div>
  );
};
