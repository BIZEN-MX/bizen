"use client";
import * as React from "react";

type Props = { question: string; answer: string };

function safeId(input: string) {
  return input.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "").slice(0, 64);
}

export default function AccordionItem({ question, answer }: Props) {
  const [open, setOpen] = React.useState(false);
  const id = React.useMemo(() => safeId(question), [question]);

  return (
    <div className={`accordion-item ${open ? "open" : ""}`} role="listitem">
      <button
        className="accordion-trigger"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={id}
        type="button"
      >
        <span>{question}</span>
        <svg className="chev" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      <div id={id} className="accordion-panel" role="region" aria-labelledby={id}>
        <p>{answer}</p>
      </div>
    </div>
  );
}
