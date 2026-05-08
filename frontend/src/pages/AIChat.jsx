import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

function AIChat() {

  const { user } = useUser();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!message) return;

    setLoading(true);

    const res = await fetch("http://localhost:5000/ai/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        userId: user.id,
        message
      })
    });

    const data = await res.json();

    setMessages(data.messages);

    setMessage("");

    setLoading(false);
  };

  return (
    <div className="p-6">

      <h1 className="text-9xl font-bold mb-4">
        AI Career Assistant
      </h1>

      <div className="border h-[500px] overflow-y-auto p-4 rounded">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user"
                ? "text-right"
                : "text-left"
            }`}
          >

            <div
              className={`inline-block p-3 rounded ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {msg.content}
            </div>

          </div>
        ))}

      </div>

      <div className="flex gap-2 mt-4">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask AI..."
          className="border p-2 flex-1"
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4"
        >
          {loading ? "Sending..." : "Send"}
        </button>

      </div>

    </div>
  );
}

export default AIChat;