import React, { useState } from "react";
import { Bookmark, Copy, Trash2, X, Download, ShieldCheck, Search, SearchCode } from "lucide-react";
import { SavedUsername } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface SavedUsernamesProps {
  savedList: SavedUsername[];
  onRemove: (id: string) => void;
  onCheckAvailability: (username: string) => void;
  onClearAll: () => void;
}

export default function SavedUsernames({
  savedList,
  onRemove,
  onCheckAvailability,
  onClearAll
}: SavedUsernamesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (username: string, id: string) => {
    navigator.clipboard.writeText(username);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExport = () => {
    if (savedList.length === 0) return;
    const lines = savedList.map(item => `Username: @${item.username}\nStyle: ${item.style}\nMeaning: ${item.meaning}\nSuitability: ${item.suitability}\nSaved on: ${item.savedAt}\n-----------------------------------\n`);
    const content = `---- NAMECRAFT EXPORTED USERNAMES ----\nTotal Saved: ${savedList.length}\n\n` + lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `namecraft-saved-handles-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredList = savedList.filter(item =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-zinc-950/85 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-5 shadow-lg flex flex-col h-full" id="saved-names-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg">
            <Bookmark className="w-5 h-5 fill-indigo-400/20" />
          </div>
          <div>
            <h3 className="font-black text-zinc-100 flex items-center gap-2 uppercase tracking-tighter text-lg">
              Favorites
              <span className="text-[10px] bg-indigo-600 text-white font-mono py-0.5 px-2 rounded font-black">
                {savedList.length}
              </span>
            </h3>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-0.5">Your curated identities</p>
          </div>
        </div>

        {savedList.length > 0 && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleExport}
              title="Export all to text file"
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClearAll}
              title="Clear all saved"
              className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              id="clear-all-saved-btn"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {savedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center flex-grow">
          <div className="w-12 h-12 rounded-full border border-zinc-800/60 flex items-center justify-center p-3 text-zinc-600 bg-zinc-900/40 mb-3">
            <Bookmark className="w-6 h-6 stroke-[1.5]" />
          </div>
          <p className="text-sm font-medium text-zinc-400">List is empty</p>
          <p className="text-xs text-zinc-600 max-w-[200px] mt-1 leading-normal">
            Double-click or click the bookmark icon on any card to save usernames you like.
          </p>
        </div>
      ) : (
        <div className="flex flex-col flex-grow mt-4 overflow-hidden">
          {/* Search bar */}
          <div className="relative mb-3.5">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20"
            />
          </div>

          {/* List */}
          <div className="space-y-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-850 pr-1 flex-grow">
            <AnimatePresence initial={false}>
              {filteredList.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.15 }}
                  className="p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 rounded-xl group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm font-semibold text-zinc-200 select-all group-hover:text-amber-300 transition-colors">
                        @{item.username}
                      </span>
                      <span className="text-[10px] ml-2 text-zinc-500 px-1.5 py-0.5 rounded-full bg-zinc-950 border border-zinc-800">
                        {item.style}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(item.username, item.id)}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === item.id ? (
                          <span className="text-[10px] text-emerald-400 font-medium px-1">Copied</span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onCheckAvailability(item.username)}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded-md transition-colors"
                        title="Check registry availability"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-md transition-colors"
                        title="Unsave"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1.5 leading-normal">
                    {item.meaning}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1 font-sans italic">
                    {item.suitability}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredList.length === 0 && searchTerm && (
              <div className="text-center py-8 text-zinc-600 text-xs">
                No matching favorites found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
