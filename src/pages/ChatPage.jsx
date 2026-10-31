import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Database, FileSpreadsheet, Plus, SendHorizontal, Sparkles } from 'lucide-react';
import ChatMessage, { TypingIndicator } from '../components/ChatMessage.jsx';
import DropdownSelect from '../components/DropdownSelect.jsx';
import { useAppState } from '../context/AppState.jsx';
import { buildChatResponse, dataSources, drillDownResponse, suggestedQuestions, workspace } from '../data/mockData.js';

const RESPONSE_DELAY_MS = 900;

const welcome = {
  id: 'welcome',
  role: 'assistant',
  text: `Hi ${workspace.user.name.split(' ')[0]}. I can answer questions about RetailCo's October 2026 sales using the retail_sales_analytics dataset. Pick a question to get started, or type your own.`,
  showSuggestions: true,
};

export default function ChatPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { conversations, addChatMessage, outputRows, pinInsight, pinned } = useAppState();
  const [input, setInput] = useState('');
  const [thinkingFor, setThinkingFor] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const messages = conversations.find((item) => item.id === conversationId)?.messages ?? [];
  const thinking = thinkingFor === conversationId && conversationId !== undefined;
  const conversation = [welcome, ...messages];
  const lastInsight = [...messages].reverse().find((m) => m.insight)?.insight;

  useEffect(() => {
    if (conversationId && !conversations.some((item) => item.id === conversationId)) {
      navigate('/chat', { replace: true });
      return;
    }

    setInput('');
  }, [conversationId, navigate]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [conversationId, messages.length, thinking]);

  const respond = (chatId, makeResponse) => {
    setThinkingFor(chatId);
    setTimeout(() => {
      const res = makeResponse();
      addChatMessage({ id: `a-${Date.now()}`, role: 'assistant', ...res }, chatId);
      setThinkingFor((id) => (id === chatId ? null : id));
    }, RESPONSE_DELAY_MS);
  };

  const ask = (text) => {
    const question = text.trim();
    if (!question || thinking) return;
    const chatId = addChatMessage({ id: `u-${Date.now()}`, role: 'user', text: question }, conversationId);
    if (!conversationId) navigate(`/chat/${chatId}`, { replace: true });
    setInput('');
    respond(chatId, () => buildChatResponse(question, outputRows, lastInsight));
  };

  const drillDown = (insight) => {
    if (thinking) return;
    const chatId = addChatMessage({ id: `u-${Date.now()}`, role: 'user', text: `Drill down into "${insight.title}"` }, conversationId);
    respond(chatId, () => drillDownResponse(insight, outputRows));
  };

  const startNewConversation = () => {
    setInput('');
    setThinkingFor(null);
    navigate('/chat');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem-4rem-env(safe-area-inset-bottom))] flex-col overflow-hidden md:h-dvh">
      {/* Header */}
      <header className="border-b border-line bg-white px-3 py-2 sm:px-6 sm:py-3 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
                <Sparkles className="size-5 shrink-0 text-blue-600" aria-hidden="true" /> Ask RetailCo
              </h1>
              <p className="hidden text-xs text-muted sm:block sm:text-sm">Ask questions about sales, regions, stores and products in plain English.</p>
            </div>
            <button type="button" onClick={startNewConversation} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:gap-2 sm:px-3" aria-label="Start a new conversation">
              <Plus className="size-4" aria-hidden="true" />
              <span className="sm:hidden">New chat</span>
              <span className="hidden sm:inline">New conversation</span>
            </button>
          </div>
          <ul className="mt-2 hidden flex-wrap gap-1.5 text-xs lg:flex" aria-label="Connected data sources">
            <li className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-600"><Database className="size-3.5" aria-hidden="true" /> {dataSources.database.name}</li>
            <li className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-600"><FileSpreadsheet className="size-3.5" aria-hidden="true" /> {dataSources.upload.name}</li>
          </ul>
        </div>
        {conversations.length > 0 && (
          <DropdownSelect
            id="recent-conversations"
            label="Recent conversations"
            value={conversationId ?? ''}
            placeholder="Recent conversations"
            options={conversations.map((item) => ({ value: item.id, label: item.title }))}
            onChange={(id) => navigate(`/chat/${id}`)}
            wrapperClassName="mx-auto mt-2 max-w-3xl lg:hidden"
            buttonClassName="h-10"
          />
        )}
      </header>

      {/* Conversation */}
      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8" role="log" aria-label="Conversation" aria-live="polite">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {conversation.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              suggestions={suggestedQuestions}
              onSuggestion={ask}
              onPin={pinInsight}
              isPinned={m.insight ? pinned.some((p) => p.id === m.insight.id) : false}
              onDrillDown={drillDown}
              onViewPipeline={() => navigate('/pipelines/retail-sales-enrichment')}
            />
          ))}
          {thinking && <TypingIndicator />}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-line bg-white px-4 py-3 sm:px-6 lg:px-8">
        <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl items-center gap-2">
          <label htmlFor="chat-input" className="sr-only">Ask a question about RetailCo data</label>
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lastInsight ? 'Ask a follow-up, e.g. "Change this to a line chart"' : 'Ask about revenue, regions, stores…'}
            autoComplete="off"
            className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-slate-50 px-4 text-[16px] text-ink placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            aria-label="Send message"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300"
          >
            <SendHorizontal className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
        <p className="mx-auto mt-1.5 max-w-3xl text-[11px] text-muted">Responses are simulated from local sample data for this prototype.</p>
      </div>
    </div>
  );
}
