"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  // Theme state: default to dark to match your reference design
  const [isDarkMode, setIsDarkMode] = useState(true);
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
    <div 
      className={`min-h-screen flex flex-col justify-between transition-colors duration-500 ease-in-out selection:bg-blue-500/30 ${
        isDarkMode 
          ? "bg-[#070913] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#070913] to-[#030408] text-slate-100 selection:text-blue-200" 
          : "bg-[#f4f7fa] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/50 via-[#f4f7fa] to-[#e9f0f8] text-slate-800 selection:text-blue-900"
      }`}
    >
      {/* Dynamic Header & Absolute Theme Switcher */}
      <header className="w-full max-w-3xl mx-auto px-6 pt-12 pb-6 text-center z-10 relative">
        {/* Floating Utility Theme Toggle */}
        <div className="absolute right-6 top-6">
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-xl border transition-all duration-300 backdrop-blur-md active:scale-95 shadow-sm ${
              isDarkMode 
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-yellow-400" 
                : "bg-black/5 border-black/5 hover:bg-black/10 text-indigo-600"
            }`}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              // Moon Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <h1 className={`text-4xl md:text-5xl font-semibold tracking-tight mb-3 transition-colors duration-500 ${
          isDarkMode 
            ? "bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent" 
            : "text-slate-900"
        }`}>
          Academic Pathway Mentor
        </h1>
        <p className={`text-sm md:text-base max-w-md mx-auto leading-relaxed transition-colors duration-500 ${
          isDarkMode ? "text-slate-400" : "text-slate-600"
        }`}>
          From curriculum to career. Generate, design, and plan your academic native path with an AI companion.
        </p>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 overflow-y-auto mb-[180px] scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center mt-12">
            <p className={`text-xs uppercase tracking-widest font-semibold mb-4 ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}>
              Suggested Pathways
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {["Computer Science", "Pre-Med Route", "Data Science", "Business Honors"].map((pathway) => (
                <button
                  key={pathway}
                  onClick={() => {
                    if (inputRef.current) {
                      const clickEvent = { target: { value: `Help me map out a pathway for ${pathway}` } } as any;
                      handleInput(clickEvent);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                    isDarkMode 
                      ? "bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:border-white/20" 
                      : "bg-black/[0.03] border border-black/5 hover:bg-black/[0.06] text-slate-700 hover:border-black/10"
                  }`}
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
                <span className={`text-[10px] uppercase tracking-wider mb-1 px-1 ${
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                }`}>
                  {m.role === "user" ? "Student" : "Professor AI"}
                </span>
                
                <div
                  className={`p-4 rounded-2xl shadow-xl transition-all duration-300 ${
                    m.role === "user"
                      ? "bg-blue-600 text-white max-w-[85%] rounded-tr-none shadow-blue-500/10"
                      : isDarkMode 
                        ? "bg-white/5 border border-white/10 text-slate-200 max-w-[85%] rounded-tl-none backdrop-blur-md"
                        : "bg-white border border-slate-200/80 text-slate-800 max-w-[85%] rounded-tl-none shadow-slate-200/50"
                  }`}
                >
                  <Markdown
                    className={`whitespace-pre-wrap prose prose-sm max-w-none prose-headings:font-semibold ${
                      isDarkMode 
                        ? "prose-invert prose-headings:text-white prose-a:text-blue-400" 
                        : "text-slate-800 prose-headings:text-slate-900 prose-a:text-blue-600"
                    }`}
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
      <footer className={`fixed bottom-0 left-0 right-0 pt-10 pb-6 px-4 z-20 bg-gradient-to-t via-transparent to-transparent transition-colors duration-500 ${
        isDarkMode ? "from-[#070913] via-[#070913]/90" : "from-[#f4f7fa] via-[#f4f7fa]/90"
      }`}>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
          {/* Theme adaptive Glass Box */}
          <div className={`relative flex items-end rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
            isDarkMode 
              ? "bg-white/[0.07] border-white/[0.08] shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)] focus-within:border-blue-500/50 focus-within:shadow-[0_0_50px_-6px_rgba(59,130,246,0.3)]" 
              : "bg-white/70 border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] focus-within:border-blue-500/50 focus-within:shadow-[0_10px_40px_-6px_rgba(59,130,246,0.15)]"
          }`}>
            <textarea
              ref={inputRef}
              onKeyDown={handleKeyDown}
              className={`flex-grow pr-24 pl-3 py-2 rounded-xl focus:outline-none resize-none bg-transparent text-base leading-relaxed transition-colors duration-300 ${
                isDarkMode ? "text-white placeholder:text-slate-400/70" : "text-slate-900 placeholder:text-slate-400"
              } ${maxHeightReached ? "overflow-y-auto" : "overflow-hidden"}`}
              value={input}
              placeholder="Ask something about your academic pathway..."
              onChange={handleInput}
              style={{ height: inputHeight }}
            />
            
            {/* Theme Adaptive Generate Action Button */}
            <button
              type="submit"
              className={`absolute right-3 bottom-3 font-medium rounded-xl px-4 h-10 flex items-center justify-center active:scale-95 transition-all duration-150 shadow-md group ${
                isDarkMode 
                  ? "bg-white text-slate-950 hover:bg-slate-200" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
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
          <p className="text-center text-[11px] text-slate-400 mt-3 tracking-wide">
            Press{" "}
            <kbd className={`px-1.5 py-0.5 border rounded text-[10px] ${
              isDarkMode ? "bg-white/5 border-white/10 text-slate-400" : "bg-black/[0.03] border-black/10 text-slate-500"
            }`}>
              Enter
            </kbd>{" "}
            to send · Launching your goals 10x faster
          </p>
        </form>
      </footer>
    </div>
  );
}