import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AvailabilityResults } from "../types";

interface AvailabilityCheckerModalProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AvailabilityCheckerModal({ username, isOpen, onClose }: AvailabilityCheckerModalProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AvailabilityResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (nameToCheck: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: nameToCheck })
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setResults(data.results);
      } else {
        throw new Error(data.error || "Failed to query server check.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to complete security/API validations at this time. Direct verification options are provided below.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && username) {
      checkAvailability(username);
    }
  }, [isOpen, username]);

  if (!isOpen) return null;

  const platforms = [
    { key: "github", label: "GitHub", domain: "github.com", desc: "Developer profile & Repos" },
    { key: "reddit", label: "Reddit", domain: "reddit.com", desc: "Community discussion handle" },
    { key: "twitch", label: "Twitch", domain: "twitch.tv", desc: "Live streaming & Creator feed" },
    { key: "devto", label: "Dev.to", domain: "dev.to", desc: "Software engineer journaling" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="availability-modal-overlay">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-805 text-zinc-100 rounded-2xl shadow-xl overflow-hidden"
          id="availability-modal-content"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <div>
              <h3 className="text-lg font-semibold text-zinc-200">
                Verify Availability
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Checking handle <span className="font-mono text-amber-400 font-bold">@{username}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
              id="close-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4" id="loading-spinner-container">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm text-zinc-400 font-medium">Querying platform registries...</p>
              </div>
            )}

            {!loading && error && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex items-start gap-3" id="error-alert">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <p className="font-medium text-amber-300">Validation Notice</p>
                  <p className="text-xs text-amber-400/80 mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && results && (
              <div className="grid gap-3" id="availability-grid">
                {platforms.map((platform) => {
                  const checkData = results[platform.key as keyof AvailabilityResults];
                  const isAvailable = checkData?.available ?? true;
                  const confirmed = checkData?.confirmed ?? false;
                  const profileUrl = checkData?.url || `https://${platform.domain}/${username}`;

                  return (
                    <div
                      key={platform.key}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-800 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {isAvailable ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-zinc-200">{platform.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              isAvailable 
                                ? 'bg-emerald-500/20 text-emerald-300' 
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {isAvailable ? 'Available' : 'Claimed'}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-500 block">{platform.desc}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-400 py-1.5 px-3 rounded-lg transition-colors font-medium"
                        >
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick check tip */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/60" id="search-deep-link">
              <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide">
                <span>⚡</span> Quick Search Alternatives
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Sometimes platform APIs can miss custom shadow bans or inactive handles. You can verify anywhere with a fast lookup:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <a
                  href={`https://www.google.com/search?q=%22${username}%22`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] hover:text-white hover:bg-zinc-800 border border-zinc-800 bg-zinc-900 py-1.5 px-3 rounded-lg text-zinc-300 font-medium transition-colors"
                >
                  Search on Google
                </a>
                <a
                  href={`https://namechek.com/info/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] hover:text-white hover:bg-zinc-800 border border-zinc-800 bg-zinc-900 py-1.5 px-3 rounded-lg text-zinc-300 font-medium transition-colors"
                >
                  Verify on Namechek
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 bg-zinc-950 border-t border-zinc-800">
            <button
              onClick={() => checkAvailability(username)}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 py-2 px-3 rounded-lg bg-zinc-900 cursor-pointer disabled:opacity-50 transition-colors"
              id="refresh-verification"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-Scan Registry
            </button>
            <button
              onClick={onClose}
              className="text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 px-4 rounded-lg cursor-pointer transition-colors"
              id="close-modal-footer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
