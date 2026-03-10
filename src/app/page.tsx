import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-black font-sans text-zinc-100 flex flex-col items-center justify-center p-4 md:p-8 selection:bg-blue-500/30 overflow-hidden relative">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen opacity-70 animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen opacity-70" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10">
        {/* Header section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 mb-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Digital Twin Online</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            Mael Jerome
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium tracking-wide max-w-lg mx-auto">
            Senior Fullstack Engineer. Engage with an interactive version of my portfolio.
          </p>
        </div>

        {/* Chat Component */}
        <ChatInterface />
      </div>

    </main>
  );
}
