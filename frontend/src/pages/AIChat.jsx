import { API_URL } from "../config";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Send, Loader2, Bot, User, Sparkles, MessageCircle, ArrowDown } from "lucide-react";

function AIChat() {
    const { user } = useUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Fetch chat history on page load
    useEffect(() => {
        if (!user) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`${API_URL}/ai/chathistory/${user.id}`);
                const data = await res.json();

                // Handle both response formats
                if (data.messages) {
                    setMessages(data.messages);
                } else if (Array.isArray(data)) {
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, [user]);

    // Send message
    const sendMessage = async () => {
        if (!message.trim() || loading) return;

        setLoading(true);

        // Add user message immediately (optimistic update)
        const userMessage = { role: "user", content: message.trim() };
        setMessages(prev => [...prev, userMessage]);

        try {
            const res = await fetch(`${API_URL}/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    message: message.trim()
                })
            });

            const data = await res.json();

            // ✅ Replace with full history from backend
            if (data.messages) {
                setMessages(data.messages);
            } else if (data.reply) {
                // Fallback if backend doesn't return full history
                setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
            }

            setMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
            // Remove optimistic user message on error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle scroll button visibility
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            setShowScrollButton(!isNearBottom && messages.length > 0);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [messages]);

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="mb-8 w-full mx-auto -mt-20 h-[80vh] flex flex-col">

            {/* Chat Messages Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto bg-gray-50 rounded-2xl p-4 space-y-4 relative hide-scrollbar"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-10 h-10 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a conversation</h3>
                        <p className="text-gray-500 max-w-md">
                            Ask me about job opportunities, resume tips, career advice, or anything else!
                        </p>
                        <div className="flex flex-wrap gap-2 mt-6 justify-center">
                            <button
                                onClick={() => setMessage("Can you analyze my resume?")}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                            >
                                📄 Analyze my resume
                            </button>
                            <button
                                onClick={() => setMessage("What jobs match my skills?")}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                            >
                                💼 Find matching jobs
                            </button>
                            <button
                                onClick={() => setMessage("How can I improve my resume?")}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                            >
                                ✨ Resume tips
                            </button>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user"
                                        ? "max-[374px]:hidden bg-blue-500"
                                        : "max-[374px]:hidden bg-gradient-to-r from-purple-500 to-indigo-500"
                                    }`}>
                                    {msg.role === "user"
                                        ? <User className="w-4 h-4 text-white" />
                                        : <Bot className="w-4 h-4 text-white" />
                                    }
                                </div>

                                {/* Message Bubble */}
                                <div className={`rounded-2xl px-4 py-3 ${msg.role === "user"
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                        : "bg-white border border-gray-200 text-gray-700"
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
                <button
                    onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="fixed bottom-24 right-8 z-50 bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:shadow-xl transition-all"
                >
                    <ArrowDown className="w-5 h-5 text-gray-600" />
                </button>
            )}

            {/* Input Area */}
            <div className="fixed bottom-4 right-4 left-4 max-w-4xl mx-auto">
                <div className="flex gap-3 items-end bg-white rounded-2xl border border-gray-200 p-2 shadow-sm focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask AI..."
                        className="scrollbar flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none resize-none min-h-[52px] max-h-32 bg-transparent"
                        rows={1}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!message.trim() || loading}
                        className={`
              my-2 md:my-1 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
              ${!message.trim() || loading
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
                            }
            `}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AIChat;