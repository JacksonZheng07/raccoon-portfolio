"use client";

import { useState, type FormEvent } from "react";
import { AUTHOR_EMAIL } from "@/lib/site";

// The site is static, so mail goes through FormSubmit; its first message asks the owner to confirm once.
const ENDPOINT = `https://formsubmit.co/ajax/${AUTHOR_EMAIL}`;

type Bubble = { from: "them" | "me"; text: string; status?: "sending" | "delivered" | "failed" };

const GREETING: Bubble[] = [
  { from: "them", text: "Hey! Thanks for stopping by." },
  { from: "them", text: "Leave your name, an email I can reply to, and a message. It comes straight to my inbox." },
];

export function MessagesApp() {
  const [bubbles, setBubbles] = useState<Bubble[]>(GREETING);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const index = bubbles.length;
    const mark = (status: Bubble["status"]) =>
      setBubbles((bs) => bs.map((b, i) => (i === index ? { ...b, status } : b)));

    setBubbles((bs) => [...bs, { from: "me", text, status: "sending" }]);
    setText("");
    setSending(true);
    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: text,
          _subject: `Jackson OS message from ${name || "a visitor"}`,
          _template: "table",
        }),
      });
      const body = (await r.json().catch(() => ({}))) as { success?: string | boolean };
      if (!r.ok || String(body.success) !== "true") throw new Error();
      mark("delivered");
      setBubbles((bs) => [...bs, { from: "them", text: "Got it, I'll get back to you soon." }]);
    } catch {
      mark("failed");
      setBubbles((bs) => [
        ...bs,
        { from: "them", text: `That didn't go through. You can email me directly at ${AUTHOR_EMAIL}.` },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="messages">
      <header className="messages-head">
        <div className="about-avatar" aria-hidden="true">
          JZ
        </div>
        <strong>Jackson Zheng</strong>
      </header>

      <ol className="messages-thread" aria-live="polite">
        {bubbles.map((b, i) => (
          <li key={i} className="bubble" data-from={b.from}>
            {b.text}
            {b.status && <span className="bubble-status">{b.status === "sending" ? "Sending…" : b.status === "delivered" ? "Delivered" : "Not delivered"}</span>}
          </li>
        ))}
      </ol>

      <form className="messages-compose" onSubmit={send}>
        <div className="messages-from">
          <input aria-label="Your name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input
            aria-label="Your email"
            placeholder="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="messages-input">
          <input aria-label="Message" placeholder="iMessage" value={text} onChange={(e) => setText(e.target.value)} required />
          <button type="submit" aria-label="Send" disabled={sending || !text.trim()}>
            ↑
          </button>
        </div>
      </form>
    </div>
  );
}
