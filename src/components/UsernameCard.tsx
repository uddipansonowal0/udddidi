import React, { useState } from "react";
import { Copy, ShieldCheck, Bookmark, Check, Sparkles, MonitorSmartphone } from "lucide-react";
import { GeneratedUsername } from "../types";
import { motion } from "motion/react";

interface UsernameCardProps {
  key?: string;
  item: GeneratedUsername;
  isSaved: boolean;
  onToggleSave: () => void;
  onCheckAvailability: () => void;
}

export default function UsernameCard({
  item,
  isSaved,
  onToggleSave,
  onCheckAvailability
}: UsernameCardProps): any {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500 rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden transition-all shadow-sm cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5"
    >
      {/* Background ambient lighting on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all pointer-events-none" />

      <div>
        {/* Style Badge and Bookmark */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/15">
            {item.style}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isSaved 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-bold scale-110' 
                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
            }`}
            title={isSaved ? "Saved to Favorites" : "Save to Favorites"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Username Display */}
        <div className="relative mb-3">
          <div className="flex items-baseline gap-0.5">
            <span className="text-indigo-500 font-mono text-xl font-bold pr-0.5 select-none">[ @ ]</span>
            <h3 className="text-2xl font-black tracking-tighter text-white font-mono break-all select-all leading-tight group-hover:text-indigo-400 transition-colors">
              {item.username}
            </h3>
          </div>
        </div>

        {/* Semantic Concept / Meaning */}
        <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-3 select-text font-medium">
          {item.meaning}
        </p>

        {/* Suitability Badge */}
        <div className="text-[11px] text-zinc-500 font-sans italic flex items-start gap-1 pb-4 border-b border-zinc-800/40">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400/80 mt-0.5 flex-shrink-0" />
          <span className="font-semibold">{item.suitability}</span>
        </div>
      </div>

      {/* Footer Controls & Live Preview Toggle */}
      <div className="pt-4 flex flex-col gap-3">
        {/* Action button panel */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900 text-zinc-450 hover:text-white transition-all cursor-pointer"
            id={`copy-${item.username}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                <span>Copy Handle</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCheckAvailability();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            id={`check-${item.username}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify</span>
          </button>
        </div>

        {/* Mini Preview button */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1 py-1 px-1.5 hover:bg-zinc-950 rounded-md transition-colors w-full cursor-pointer"
        >
          <MonitorSmartphone className="w-3 h-3" />
          {showPreview ? "Hide Live Mockups" : "See Profile Previews"}
        </button>

        {/* Mini Profile Mockups Drawer */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-1 space-y-2.5 border-t border-zinc-800/40 pt-2.5"
            id={`preview-drawer-${item.username}`}
          >
            {/* GitHub Card Preview */}
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-2.5 text-[11px] font-sans">
              <div className="flex items-center gap-1.5 pb-1 border-b border-zinc-80:border-zinc-800/30 text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                💻 GitHub Mockup
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-[9px] font-bold text-indigo-400 flex items-center justify-center">
                  NC
                </div>
                <div>
                  <div className="font-semibold text-zinc-200">NameCraft Creator</div>
                  <div className="font-mono text-[10px] text-zinc-400">github.com/{item.username}</div>
                </div>
              </div>
              <div className="mt-1.5 font-mono text-[9px] text-zinc-500">
                Repositories: 12 · Stars: 42
              </div>
            </div>

            {/* Discord Name Preview */}
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-2.5 text-[11px] font-sans">
              <div className="flex items-center gap-1.5 pb-1 border-b border-zinc-800/30 text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                💬 discord display handles
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[9px] font-mono">
                    NC
                  </div>
                  <div className="absolute right-0 bottom-0 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-900" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-200">{item.username}</div>
                  <div className="text-[9px] text-zinc-500">Online · Playing NameCraft</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
