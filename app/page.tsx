"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const [inputHeight, setInputHeight] = useState("56px");
  const [maxHeightReached, setMaxHeightReached] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (typeof handleInputChange === "function") {
      handleInputChange(e);
    }

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      const newHeight = inputRef.current.scrollHeight;
      if (newHeight > 160) {
        setMaxHeightReached(true);
        setInputHeight("160px");
      } else {
        setMaxHeightReached(false);
        setInputHeight(`${newHeight}px`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    // Immersive Dark Mesh Background inspired by the reference image
    <div className="min-h-screen bg-[#070913] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#070913] to-[#030408] text-slate-100 flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Dynamic Header */}
      <header className="w-full max-w-3xl mx-auto px-6 pt-12 pb-6 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-3">
          Academic Pathway Mentor
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          From curriculum to career. Generate, design, and plan your academic native path with an AI companion.
        </p>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 overflow-y-auto mb-[180px] scrollbar-thin">
        {messages.length === 0 ? (
          // Empty State Prompt suggestions looking like platform pills
          <div className="flex flex-col items-center justify-center h-full text-center mt-12 animate-fade-in">
            <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-4">Suggested Pathways</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {["Computer Science", "Pre-Med Route", "Data Science", "Business Honors"].map((pathway) => (
                <button
                  key={pathway}
                  onClick={() => {
                    if (inputRef.current) {
                      // Simulates quick action click
                      const clickEvent = { target: { value: `Help me map out a pathway for ${pathway}` } } as any;
                      handleInput(clickEvent);
                    }
                  }}
                  className="px-4 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-slate-300"
                >
                  {pathway}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 px-1">
                  {m.role === "user" ? "Student" : "Professor AI"}
                </span>
                
                <div
                  className={`p-4 rounded-2xl shadow-xl transition-all ${
                    m.role === "user"
                      ? "bg-blue-600 text-white max-w-[85%] rounded-tr-none"
                      : "bg-white/5 border border-white/10 text-slate-200 max-w-[85%] rounded-tl-none backdrop-blur-md"
                  }`}
                >
                  <Markdown
                    className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-blue-400"
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {m.content}
                  </Markdown>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Sticky Glassmorphic Input Box Container */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#070913] via-[#070913]/90 to-transparent pt-10 pb-6 px-4 z-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto"
        >
          {/* Main Glass Box */}
          <div className="relative flex items-end rounded-2xl bg-white/[0.07] border border-white/[0.08] shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)] focus-within:border-blue-500/50 focus-within:shadow-[0_0_50px_-6px_rgba(59,130,246,0.3)] p-3 backdrop-blur-xl transition-all duration-300">
            <textarea
              ref={inputRef}
              onKeyDown={handleKeyDown}
              className={`flex-grow pr-16 pl-3 py-2 rounded-xl focus:outline-none resize-none bg-transparent text-white text-base placeholder:text-slate-400/70 leading-relaxed ${
                maxHeightReached ? "overflow-y-auto" : "overflow-hidden"
              }`}
              value={input}
              placeholder="Ask something about your academic pathway..."
              onChange={handleInput}
              style={{ height: inputHeight }}
            />
            
            {/* Generate Action Button */}
            <button
              type="submit"
              className="absolute right-3 bottom-3 bg-white text-slate-950 font-medium rounded-xl px-4 h-10 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all duration-150 shadow-md group"
            >
              <span className="text-sm mr-1.5">Generate</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          
          {/* Secondary Footer Notes */}
          <p className="text-center text-[11px] text-slate-500 mt-3 tracking-wide">
            Press <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400 text-[10px]">Enter</kbd> to send · Launching your goals 10x faster
          </p>
        </form>
      </footer>
    </div>
  );
}