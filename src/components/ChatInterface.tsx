'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello ! Je suis le double numérique de Mael Jerome, Ingénieur Fullstack Senior. Demandez-moi ce que vous voulez savoir sur ses expériences ou ses projets.'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] })
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Désolé, une erreur technique est survenue.' }]);
            } else {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.content }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Impossible de joindre le serveur. Veuillez vérifier votre connexion.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] max-h-[85vh] w-full max-w-3xl bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center space-x-4 px-6 py-5 border-b border-zinc-800/50 bg-zinc-900/60">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Bot className="w-6 h-6 text-white" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-zinc-100 tracking-tight">AI Double</h2>
                    <p className="text-sm text-zinc-400 font-medium">Assistant interactif de Mael Jerome</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[85%] space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${m.role === 'user' ? 'bg-zinc-800 border border-zinc-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                                    {m.role === 'user' ? <User className="w-5 h-5 text-zinc-300" /> : <Bot className="w-5 h-5 text-white" />}
                                </div>
                                <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${m.role === 'user'
                                        ? 'bg-zinc-100 text-zinc-900 rounded-tr-sm font-medium'
                                        : 'bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 flex flex-col items-start rounded-tl-sm backdrop-blur-sm'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{m.content}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-start"
                        >
                            <div className="flex space-x-3 max-w-[85%]">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md border border-zinc-700/50">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-zinc-800/80 border border-zinc-700/50 flex items-center space-x-3 backdrop-blur-sm shadow-sm">
                                    <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                                    <span className="text-zinc-400 text-[15px] font-medium animate-pulse">L'IA réfléchit...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-5 bg-zinc-900/60 border-t border-zinc-800/50">
                <div className="relative flex items-center group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Écrivez un message..."
                        disabled={isLoading}
                        className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-500 text-[15px] rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-zinc-700 transition-all disabled:opacity-50 shadow-inner group-hover:border-zinc-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2.5 rounded-full bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors shadow-md transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
