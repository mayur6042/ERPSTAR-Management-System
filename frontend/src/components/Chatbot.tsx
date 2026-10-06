import { Bot, MessageSquareText, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ApiError, request } from "../services/api";
import "./Chatbot.css";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What products need reordering?",
  "Summarize this month's expenses.",
  "How many open sales orders do we have?",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending, error, open]);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const conversation = [...messages, userMessage].slice(-12);
    if (conversation[0]?.role === "assistant") conversation.shift();

    setDraft("");
    setPending(trimmed);
    setSending(true);
    setError("");
    try {
      const result = await request<{ message: string }>("/chat", {
        method: "POST",
        body: JSON.stringify({ messages: conversation }),
      });
      const assistantMessage: ChatMessage = { role: "assistant", content: result.message };
      setMessages([...conversation, assistantMessage].slice(-12));
    } catch (caught) {
      setDraft(trimmed);
      setError(caught instanceof ApiError ? caught.message : "The assistant could not respond. Please try again.");
    } finally {
      setPending("");
      setSending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(draft);
    }
  }

  return (
    <>
      {open && (
        <section className="chat-panel" aria-label="ERPStar assistant">
          <header className="chat-header">
            <span className="chat-brand-icon"><Sparkles size={17} /></span>
            <div className="chat-heading"><strong>ERPStar assistant</strong><span><span className="chat-live-dot" /> Live ERP data · AI optional</span></div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></button>
          </header>

          <div className="chat-messages" aria-live="polite">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <span className="chat-welcome-icon"><Bot size={22} /></span>
                <strong>Your ERP, at your fingertips.</strong>
                <p>Ask about your live inventory, orders, team, customers, suppliers, or expenses.</p>
                <span className="chat-suggestion-label">TRY ASKING</span>
                <div className="chat-suggestions">
                  {suggestions.map((suggestion) => (
                    <button key={suggestion} disabled={sending} onClick={() => void sendMessage(suggestion)}>{suggestion}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div className={`chat-message ${message.role}`} key={`${index}-${message.role}`}>
                {message.role === "assistant" && <span className="chat-avatar"><Sparkles size={13} /></span>}
                <p>{message.content}</p>
              </div>
            ))}
            {pending && <div className="chat-message user"><p>{pending}</p></div>}
            {sending && <div className="chat-message assistant"><span className="chat-avatar"><Sparkles size={13} /></span><div className="chat-typing" role="status" aria-label="Assistant is thinking"><i /><i /><i /></div></div>}
            {error && <div className="chat-error" role="alert">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <form className="chat-composer" onSubmit={submit}>
            <textarea
              aria-label="Message the ERP assistant"
              placeholder="Ask about your business..."
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, 2000))}
              onKeyDown={handleKeyDown}
              rows={2}
              maxLength={2000}
              disabled={sending}
            />
            <div className="chat-composer-footer"><span>Enter to send · Shift + Enter for a new line</span><button type="submit" disabled={sending || !draft.trim()} aria-label="Send message"><Send size={15} /></button></div>
          </form>
          <div className="chat-disclaimer">Read-only answers. Verify important figures in the ERP.</div>
        </section>
      )}
      <button className={`chat-launcher${open ? " is-open" : ""}`} onClick={() => setOpen((value) => !value)} aria-label={open ? "Close ERP assistant" : "Open ERP assistant"}>
        {open ? <X size={21} /> : <><MessageSquareText size={20} /><span>Ask ERP</span></>}
      </button>
    </>
  );
}
