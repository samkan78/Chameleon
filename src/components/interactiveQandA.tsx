import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyCwOokBov_jBDi9q1pejAFGc1XoFXA2sMA"; // kept hardcoded as requested

if (!API_KEY) {
  console.error("Gemini API key is missing!");
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `
You are a helpful assistant for the Chameleon App.
Only use the information provided below. Be concise and friendly.

Chameleon App is a virtual pet game.
Features:
- Choose a chameleon: Panther, Jackson's, or Nose-Horned.
- Stats: Health, Hunger, Happiness, Energy, Hydration, Temperature.
- Stats decrease every 2 minutes. Keep them high (>90%) to age up.
- Actions:
  - Health: Check Eyes, Trim Nails, Check Skin Shedding, Clean Enclosure, Vet Visit.
  - Care: Bath, Misting, Feed (needs food), Nap (restores energy), Adjust Temperature.
  - Tricks: Climbing Practice, Hand Approach, Fetch, Target Training.
  - Shop: Buy Crickets, Mealworms, Branches.
  - Earn: Clean Room, Do Homework, Shower, Laundry.

If the question is unrelated or not covered by this information, reply exactly:
"Sorry, I don't know that about the Chameleon App."
`;

interface Message {
  role: "user" | "model";
  content: string;
}

export default function QandA() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  // Initialize persistent chat session once
  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = genAI.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
        },
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !chatRef.current) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Correct method for the current SDK
      const result = await chatRef.current.sendMessage(input.trim());

      // Handle response text in current SDK (v1.35+ pattern)
      const text =
        result.text ||
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      setMessages((prev) => [...prev, { role: "model", content: text }]);
    } catch (err: any) {
      console.error("Gemini API error:", err);
      const msg = err.message || "Failed to get response";
      setMessages((prev) => [
        ...prev,
        { role: "model", content: `Error: ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 15px",
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        ?
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "320px",
            height: "420px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f8f9fa",
            }}
          >
            <strong>Chameleon App Help</strong>
            <button
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  color: "#666",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                Ask me anything about the Chameleon App!
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.role === "user" ? "#e3f2fd" : "#f5f5f5",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  maxWidth: "82%",
                  fontSize: "14px",
                }}
              >
                <strong>{msg.role === "user" ? "You" : "AI"}: </strong>
                {msg.content}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  color: "#888",
                  fontStyle: "italic",
                  alignSelf: "flex-start",
                }}
              >
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "8px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about your chameleon..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: "10px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
