"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const [inputHeight, setInputHeight] = useState("48px");
  const [maxHeightReached, setMaxHeightReached] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Guard: only call if it's a function (defensive, post-fix this should always be true)
    if (typeof handleInputChange === "function") {
      handleInputChange(e);
    }

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      const newHeight = inputRef.current.scrollHeight;
      if (newHeight > 200) {
        setMaxHeightReached(true);
        setInputHeight("200px");
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
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto mt-[15px] stretch relative">
      <div className="absolute top-0 left-0 right-0 p-4 bg-blue-100 text-blue-900 rounded-lg shadow-sm border border-blue-200 mb-4 z-10">
        <p className="text-center font-medium">
          Welcome to your Academic Pathway Mentor. I am here to guide your
          studies and help you achieve your goals.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 mt-[5rem] px-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-3 rounded-2xl ${
                m.role === "user"
                  ? "bg-slate-700 text-white max-w-[80%]"
                  : "bg-blue-50 text-blue-900 border border-blue-100 max-w-[80%]"
              }`}
            >
              <Markdown
                className="whitespace-pre-wrap prose prose-sm"
                rehypePlugins={[rehypeHighlight]}
              >
                {m.content}
              </Markdown>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
              {m.role === "user" ? "Student" : "Professor"}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Wrap in relative so the send button positions correctly */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-2xl m-auto bg-white p-4"
      >
        <div className="relative flex items-end border border-slate-200 rounded-full focus-within:ring-2 focus-within:ring-blue-500 p-1 bg-slate-50">
          <textarea
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className={`flex-grow pr-14 pl-5 py-3 rounded-full focus:outline-none resize-none bg-transparent ${
              maxHeightReached ? "overflow-y-auto" : "overflow-hidden"
            }`}
            value={input}
            placeholder="Ask a question about your pathway..."
            onChange={handleInput}
            style={{ height: inputHeight }}
          />
          <button
            type="submit"
            className="absolute right-2 bottom-2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
