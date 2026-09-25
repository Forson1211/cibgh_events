import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Award,
  CreditCard,
  MapPin,
  Users
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionLinks?: Array<{ label: string; url: string; isExternal?: boolean }>;
}

const INITIAL_SUGGESTIONS = [
  { id: 'register', label: '🎟️ How do I register?', query: 'How do I register for the conference?' },
  { id: 'cpd', label: '🎓 CPD Hours awarded?', query: 'What CPD hours are awarded?' },
  { id: 'venue', label: '📍 Dates & Venue?', query: 'Where and when is the event held?' },
  { id: 'fees', label: '💳 Ticket Pricing & MoMo?', query: 'What are the ticket prices and payment methods?' },
  { id: 'sponsor', label: '🤝 Sponsorship info?', query: 'How can my organization sponsor or exhibit?' },
];

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello! 👋 Welcome to CIB Ghana Events Secretariat. I'm your digital concierge.",
      time: getCurrentTime(),
    },
    {
      id: 'welcome-2',
      sender: 'bot',
      text: "How can I assist you today? You can ask about our upcoming 30th National Banking Conference, registration tickets, CPD accreditation, or sponsorship.",
      time: getCurrentTime(),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Generate intelligent AI response after short realistic delay
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const generateBotResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();

    // 1. Registration & Tickets
    if (
      q.includes('register') ||
      q.includes('ticket') ||
      q.includes('fee') ||
      q.includes('cost') ||
      q.includes('price') ||
      q.includes('pay') ||
      q.includes('momo') ||
      q.includes('buy')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "Registration for the **30th National Banking & Ethics Conference** is active! \n\n• **Standard Delegate**: GH₵ 2,500\n• **CIB Chartered Member**: GH₵ 1,800\n• **VIP Executive**: GH₵ 3,500\n\nPayments are processed instantly via **Paystack** (supports MTN Mobile Money, Telecel Cash, AT Money, and Visa/Mastercard debit cards).",
        time: getCurrentTime(),
        actionLinks: [
          { label: 'Register Online Now →', url: '/events/30th-national-banking-ethics-conference-2026/register' },
          { label: 'View All Programmes', url: '/events' },
        ],
      };
    }

    // 2. CPD Hours & Accreditation
    if (
      q.includes('cpd') ||
      q.includes('hour') ||
      q.includes('point') ||
      q.includes('credit') ||
      q.includes('accred') ||
      q.includes('certificate')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "The 30th National Banking & Ethics Conference awards **16 Accredited CPD Hours** under the Chartered Institute of Bankers, Ghana Act 991.\n\nAttendance is tracked electronically via your digital QR ticket, and certified digital CPD certificates are issued directly to your delegate dashboard upon conference conclusion.",
        time: getCurrentTime(),
        actionLinks: [
          { label: 'Secretariat Contact', url: '/contact' },
        ],
      };
    }

    // 3. Venue & Dates
    if (
      q.includes('venue') ||
      q.includes('where') ||
      q.includes('location') ||
      q.includes('hotel') ||
      q.includes('date') ||
      q.includes('when') ||
      q.includes('kempinski')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "📅 **Dates**: 9th – 10th November, 2026\n📍 **Venue**: Kempinski Hotel Gold Coast City, Accra, Ghana\n\nBoth **in-person** executive seating and **interactive virtual hybrid** passes are available for international and regional participants.",
        time: getCurrentTime(),
        actionLinks: [
          { label: 'Register for Kempinski Seat →', url: '/events/30th-national-banking-ethics-conference-2026/register' },
        ],
      };
    }

    // 4. Sponsorship & Partnership
    if (
      q.includes('sponsor') ||
      q.includes('partner') ||
      q.includes('exhibit') ||
      q.includes('booth') ||
      q.includes('corporate')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "CIB Ghana provides high-impact sponsorship tiers for financial institutions, fintechs, and technology partners:\n\n• **Platinum Key Partner**: Exclusive keynote session & prime exhibition foyer.\n• **Gold Partner**: Executive CEO lounge branding & 10 delegate passes.\n• **Silver & Exhibition Booth**: Dedicated promotional stand.\n\nOur secretariat can tailor custom packages to meet institutional goals.",
        time: getCurrentTime(),
        actionLinks: [
          { label: 'Sponsor / Exhibit Inquiry →', url: '/contact' },
        ],
      };
    }

    // 5. Speakers & Faculty
    if (
      q.includes('speaker') ||
      q.includes('faculty') ||
      q.includes('who') ||
      q.includes('governor') ||
      q.includes('panel')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "The conference faculty features top leadership from the **Bank of Ghana**, Managing Directors of leading commercial banks, international ESG strategists, and fintech executives.\n\nYou can explore all confirmed keynote speakers, panel chairs, and bios on our Speakers page.",
        time: getCurrentTime(),
        actionLinks: [
          { label: 'View Conference Faculty & Speakers →', url: '/speakers' },
        ],
      };
    }

    // 6. Agenda & Itinerary
    if (
      q.includes('agenda') ||
      q.includes('schedule') ||
      q.includes('time') ||
      q.includes('program') ||
      q.includes('topic')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "The 2-day conference covers:\n\n• **Day 1**: Governor's Regulatory Address, Ethical Leadership, and ESG Capital Allocation.\n• **Day 2**: AI-Driven Banking Risk, Digital Currency & Instant Payments, and Annual Banking Ethics Awards.",
        time: getCurrentTime(),
        actionLinks: [
          { label: 'View Full Agenda on Home Page', url: '/#agenda' },
        ],
      };
    }

    // 7. Contact & Secretariat Staff
    if (
      q.includes('contact') ||
      q.includes('call') ||
      q.includes('phone') ||
      q.includes('email') ||
      q.includes('human') ||
      q.includes('secretariat') ||
      q.includes('agent')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "You can reach the **CIB Ghana Events Secretariat** directly:\n\n📞 **Phone**: 0302 541 309 / 0302 541 308\n📧 **Email**: info@cibgh.org\n🏢 **Address**: Okponglo-East Legon, Trinity Avenue, Accra\n🕒 **Hours**: Mon – Fri: 8:00 AM – 5:00 PM GMT",
        time: getCurrentTime(),
        actionLinks: [
          { label: 'Open Contact Form →', url: '/contact' },
        ],
      };
    }

    // Default Fallback Response
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: "Thank you for asking! I can help you register for conferences, review CPD credits, explore the event schedule, or connect with our secretariat team. What would you like to know more about?",
      time: getCurrentTime(),
      actionLinks: [
        { label: 'Register for 30th Conference', url: '/events/30th-national-banking-ethics-conference-2026/register' },
        { label: 'Contact Secretariat', url: '/contact' },
      ],
    };
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Chat refreshed. How can the CIB Ghana Events Secretariat assist you?",
        time: getCurrentTime(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Launcher Button (Fixed bottom right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close CIB Assistant' : 'Open CIB Events Secretariat Assistant'}
          className="relative w-14 h-14 rounded-full bg-[#008129] hover:bg-[#006b22] text-white shadow-2xl flex items-center justify-center border-2 border-white/20 transition-all focus:outline-none"
          title="CIB Events Secretariat AI Concierge"
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 fill-white" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FFE500] border-2 border-[#008129]" />
                </span>
              )}
            </>
          )}
        </motion.button>
      </div>

      {/* Interactive Chatbot Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden"
          >
            {/* Header: CIB Ghana Branding */}
            <div className="bg-gradient-to-r from-[#032616] via-[#04331e] to-[#008129] text-white px-5 py-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                    <Bot className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#032616]" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-display tracking-tight text-white flex items-center gap-1.5">
                    <span>CIB Concierge</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400/90 text-slate-900 uppercase">
                      AI Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-200 font-medium">
                    Events Secretariat &bull; Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize chat"
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-header Banner */}
            <div className="bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#008129]" />
                30th National Banking Conference Assistant
              </span>
              <span className="font-mono text-emerald-700 text-[10px]">Nov 9–10, 2026</span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#008129] text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line text-[12.5px]">
                      {msg.text.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={idx} className="font-extrabold text-slate-900">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return part;
                      })}
                    </p>

                    {/* Interactive Action Links inside bot message */}
                    {msg.actionLinks && msg.actionLinks.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                        {msg.actionLinks.map((link, idx) => (
                          <Link
                            key={idx}
                            to={link.url}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#008129] font-bold text-[11.5px] transition-colors border border-emerald-200/60"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {/* Bot typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-bl-none w-fit shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008129] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008129] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008129] animate-bounce" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
              {INITIAL_SUGGESTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSendMessage(item.query)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-[#008129] text-[11px] font-semibold text-slate-600 whitespace-nowrap transition-colors border border-slate-200/70 shrink-0"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question about the conference..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#008129] focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#088d01] via-[#72ac00] to-[#dccb00] hover:brightness-105 active:scale-95 text-white disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
