import { useState } from "react";
import logo from "../icons/logo.svg";
import { askAI } from "@/services/aiService";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (customInput) => {
    const value = customInput ?? input;
    if (!value.trim() || isLoading) return;

    setMessages((prev) => [...prev, { type: "user", text: value }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askAI(value);

      console.log("RAW AI RESPONSE:", response);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: response,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Error connecting to AI" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white grid grid-rows-[auto_1fr_auto] h-full p-2 overflow-hidden shadow-md rounded-lg">
      <div className="bg-[#E7FCEF] p-5 flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-8" />
        <p className="font-semibold text-[#062732]">AI Chat Search</p>
      </div>

      <div className="p-4 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.type === "user"
                  ? "self-end bg-[#25C766] text-white"
                  : "self-start bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {isLoading && (
            <div className="self-start bg-gray-200 text-black px-4 py-2 rounded-lg max-w-[70%] flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            </div>
          )}
        </div>
      </div>

      <div className="p-3 w-full rounded-lg bg-[#F1F8F4] flex gap-2">
        <input
          placeholder="Ask me anything..."
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          disabled={isLoading}
          className="flex-1 outline-none bg-transparent disabled:opacity-50"
        />

        <button
          onClick={() => handleSubmit()}
          disabled={isLoading}
          className="bg-[#25C766] text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
