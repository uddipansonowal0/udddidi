import React from "react";
import { Sparkles, Compass, BadgeCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-zinc-800 p-6 md:p-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40" id="namecraft-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-xl text-white shadow-md shadow-indigo-500/20">
            NC
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white hover:text-indigo-400 transition-colors">
              NameCraft
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold leading-none mt-1">
              Premium Linguistic Handles
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-4 md:gap-6 items-center">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>AI Generation Engine v2.0</span>
          </div>
          <span className="hidden md:inline text-zinc-800">|</span>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <BadgeCheck className="w-4 h-4 text-indigo-400" />
            <span>Curated Results</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
