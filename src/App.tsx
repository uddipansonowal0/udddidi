import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  RotateCw, 
  Compass, 
  X, 
  Trash2, 
  Plus, 
  Check, 
  Search, 
  Bookmark, 
  Monitor, 
  HelpCircle,
  HelpCircle as QuestionIcon,
  ChevronRight,
  AlertCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Header from "./components/Header";
import BackgroundDecoration from "./components/BackgroundDecoration";
import UsernameCard from "./components/UsernameCard";
import SavedUsernames from "./components/SavedUsernames";
import AvailabilityCheckerModal from "./components/AvailabilityCheckerModal";

import { ZODIAC_SIGNS, MONTHS, INTERESTS_LIST, PERSONALITY_TRAITS, STYLE_PREFERENCES } from "./constants";
import { GeneratedUsername, SavedUsername, UserSignals } from "./types";

// Dynamic loading tips to cycle through during generations
const GENERATOR_TIPS = [
  "Formulating brand-grade synergies...",
  "Integrating zodiac and birthday markers...",
  "Analyzing semantic root syllables...",
  "Bypassing overused character clichés (No xX_)...",
  "Tailoring handles for portfolio lookups...",
  "Generating premium styling aesthetics...",
  "Refining pronounceability mechanics..."
];

// Rich, curated default usernames so the page never looks empty on first visit
const DEFAULT_STARTER_PACK: GeneratedUsername[] = [
  {
    username: "ZenKairo",
    meaning: "Blends Arabic 'Kairo' (conqueror) with Zen for a calm, powerful tech identity.",
    style: "Clean Minimalist",
    suitability: "Highly suited for developer sites, technical blogs, or elite GitHub accounts."
  },
  {
    username: "NovaArin",
    meaning: "Combines 'Nova' (celestial explosion) and 'Arin' (mountain of strength).",
    style: "Aesthetic Cosms",
    suitability: "Ideal for UX design binders, creative Instagram pages, or digital art rails."
  },
  {
    username: "FluxDev",
    meaning: "Sleek compound pairing 'Flux' (constant evolution) with 'Dev' for precise logic.",
    style: "Modern Tech",
    suitability: "Perfect for software portfolios, SaaS projects, or engineering Twitter feeds."
  },
  {
    username: "AeroVibe",
    meaning: "Synthesizes 'Aero' (air/flight) with 'Vibe' for a minimalist, effortless flow.",
    style: "Minimalist",
    suitability: "Excellent for personal creators, tech side-channels, or gaming profiles."
  },
  {
    username: "Valkyria",
    meaning: "Ethereal Nordic root referencing legendary protectors, streamlined for modern handle lengths.",
    style: "Unique Exotic",
    suitability: "Great for Twitch profiles, gaming channels, or Web3 design handles."
  },
  {
    username: "KairoConsulting",
    meaning: "A clean, grand, domain-ready premium commercial brand compound.",
    style: "Professional",
    suitability: "Superb for freelance consulting, LinkedIn aliases, or branding businesses."
  }
];

export default function App() {
  // Input states
  const [name, setName] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [stylePreference, setStylePreference] = useState<UserSignals['stylePreference']>("Clean");

  // App behaviors
  const [loading, setLoading] = useState(false);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const [generatedList, setGeneratedList] = useState<GeneratedUsername[]>(DEFAULT_STARTER_PACK);
  const [savedList, setSavedList] = useState<SavedUsername[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Availability modal target
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mobile drawer toggle
  const [mobileShowFavorites, setMobileShowFavorites] = useState(false);

  // Initialize and load saved list from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("namecraft-favorites");
      if (stored) {
        setSavedList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read favorites from localStorage:", e);
    }
  }, []);

  // Save list to localStorage on modifications
  const updateSavedList = (newList: SavedUsername[]) => {
    setSavedList(newList);
    try {
      localStorage.setItem("namecraft-favorites", JSON.stringify(newList));
    } catch (e) {
      console.error("Failed to write favorites to localStorage:", e);
    }
  };

  // Cycle loading tips
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % GENERATOR_TIPS.length);
      }, 2600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Form handle submit generator action
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setLoadingTipIndex(0);

    // Map interests IDs to label names safely for prompt
    const interestsMapped = selectedInterests.map(id => {
      const found = INTERESTS_LIST.find(item => item.id === id);
      return found ? found.label : id;
    });

    const personalityMapped = selectedPersonality.map(id => {
      const found = PERSONALITY_TRAITS.find(item => item.id === id);
      return found ? found.label : id;
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthMonth,
          zodiac,
          interests: interestsMapped,
          personality: personalityMapped,
          stylePreference
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setGeneratedList(data.data);
      } else {
        throw new Error(data.error || "Generation query failed on remote AI server.");
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Something went wrong. Verify your internet link or server setup.");
    } finally {
      setLoading(false);
    }
  };

  // Saved toggle mechanics
  const handleToggleSave = (item: GeneratedUsername) => {
    const isAlreadySaved = savedList.some(saved => saved.username.toLowerCase() === item.username.toLowerCase());
    if (isAlreadySaved) {
      const filtered = savedList.filter(saved => saved.username.toLowerCase() !== item.username.toLowerCase());
      updateSavedList(filtered);
    } else {
      const newSavedItem: SavedUsername = {
        id: Date.now().toString(),
        username: item.username,
        meaning: item.meaning,
        style: item.style,
        suitability: item.suitability,
        savedAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      updateSavedList([...savedList, newSavedItem]);
    }
  };

  const handleRemoveSaved = (id: string) => {
    const filtered = savedList.filter(item => item.id !== id);
    updateSavedList(filtered);
  };

  const handleClearAllSaved = () => {
    if (window.confirm("Are you sure you want to delete all saved usernames?")) {
      updateSavedList([]);
    }
  };

  // Toggle interest pill selection
  const handleToggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Toggle personality pill selection
  const handleTogglePersonality = (id: string) => {
    if (selectedPersonality.includes(id)) {
      setSelectedPersonality(selectedPersonality.filter(p => p !== id));
    } else {
      setSelectedPersonality([...selectedPersonality, id]);
    }
  };

  const handleOpenAvailabilityCheck = (username: string) => {
    setSelectedUsername(username);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-x-hidden font-sans">
      <BackgroundDecoration />
      <Header />

      {/* Main Grid Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12" id="namecraft-main-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Configuration Form (Inputs) */}
          <section className="lg:col-span-4 space-y-6" id="input-controls-panel">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-md p-6 shadow-sm">
              <h2 className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-black mb-4 flex items-center gap-2">
                <span>🔧</span> Define Identity
              </h2>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed font-medium">
                Provide custom identity signals. NameCraft integrates linguistic structures to blend professional and aesthetic styles.
              </p>

              <form onSubmit={handleGenerate} className="space-y-5" id="signal-builder-form">
                {/* Preferred Base Name */}
                <div className="space-y-1.5">
                  <label htmlFor="base-name" className="block text-[11px] text-zinc-400 mb-2 uppercase font-bold tracking-wider font-mono">
                    Base Name <span className="text-[10px] text-zinc-500 font-normal font-sans">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="base-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arin, Kairo, Lex"
                    className="w-full text-sm bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded px-4 py-3 placeholder-zinc-600 text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-mono font-bold"
                  />
                </div>

                {/* Birth Month and Zodiac Section */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Birth Month */}
                  <div className="space-y-1.5">
                    <label htmlFor="birth-month" className="block text-[11px] text-zinc-400 mb-2 uppercase font-bold tracking-wider font-mono">
                      Birth Month
                    </label>
                    <select
                      id="birth-month"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full text-sm bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded px-3.5 py-3 text-zinc-300 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer font-bold"
                    >
                      <option value="">Month</option>
                      {MONTHS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Zodiac Sign */}
                  <div className="space-y-1.5">
                    <label htmlFor="zodiac-sign" className="block text-[11px] text-zinc-400 mb-2 uppercase font-bold tracking-wider font-mono">
                      Zodiac Sign
                    </label>
                    <select
                      id="zodiac-sign"
                      value={zodiac}
                      onChange={(e) => setZodiac(e.target.value)}
                      className="w-full text-sm bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded px-3.5 py-3 text-zinc-300 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer font-bold"
                    >
                      <option value="">Zodiac</option>
                      {ZODIAC_SIGNS.map(z => (
                        <option key={z.name} value={z.name}>{z.symbol} {z.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Style Preferences Selector */}
                <div className="space-y-2">
                  <label className="block text-[11px] text-zinc-400 mb-2 uppercase font-bold tracking-wider font-mono">
                    Style Persona
                  </label>
                  <div className="space-y-2" id="style_preferences_container">
                    {STYLE_PREFERENCES.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setStylePreference(style.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all relative overflow-hidden flex items-start gap-2.5 cursor-pointer ${
                          stylePreference === style.id
                            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/15'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'
                        }`}
                      >
                        <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          stylePreference === style.id ? 'border-indigo-450 text-indigo-400' : 'border-zinc-700'
                        }`}>
                          {stylePreference === style.id && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-250 uppercase tracking-wide text-[11px]">{style.name}</div>
                          <span className="text-[10px] text-zinc-500 mt-0.5 block leading-normal font-medium">{style.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Interests Tags */}
                <div className="space-y-2">
                  <span className="block text-[11px] text-zinc-400 mb-2 uppercase font-bold tracking-wider font-mono">
                    Focus Interests <span className="text-[10px] text-zinc-500 font-normal font-sans">(Pick multiples)</span>
                  </span>
                  <div className="flex flex-wrap gap-2" id="interests-pillbox">
                    {INTERESTS_LIST.map(interest => {
                      const isSelected = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => handleToggleInterest(interest.id)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-all cursor-pointer font-bold ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-600 text-indigo-400 shadow-sm'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-750 hover:text-zinc-200'
                          }`}
                        >
                          <span className="text-xs">{interest.icon}</span>
                          <span>{interest.label}</span>
                          {/* Indicator */}
                          {isSelected && <Check className="w-3 h-3 text-indigo-300" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Personality traits */}
                <div className="space-y-2">
                  <span className="block text-[11px] text-zinc-400 mb-2 uppercase font-bold tracking-wider font-mono">
                    Personality Traits <span className="text-[10px] text-zinc-500 font-normal font-sans">(Pick multiples)</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5" id="personality-pillbox">
                    {PERSONALITY_TRAITS.map(trait => {
                      const isSelected = selectedPersonality.includes(trait.id);
                      return (
                        <button
                          key={trait.id}
                          type="button"
                          onClick={() => handleTogglePersonality(trait.id)}
                          className={`text-[11px] px-3 py-2 rounded border transition-all cursor-pointer font-bold text-left ${
                            isSelected
                              ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                          }`}
                          title={trait.vibe}
                        >
                          {trait.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Action button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  id="generate-cta-btn"
                >
                  {loading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-white" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300/20" />
                      <span>Forge Usernames</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Middle/Right: Output Results Column */}
          <section className="lg:col-span-5 space-y-6" id="results-display-panel">
            {/* API Errors Alert banner */}
            {apiError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-200 text-xs" id="api-error-banner">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-300">Generation Query Failed</h4>
                  <p className="text-red-400/80 mt-1 leading-relaxed">{apiError}</p>
                </div>
              </div>
            )}

            {/* Generated display wrapper */}
            <div className="mb-6">
              <p className="text-indigo-500 font-mono text-xs mb-1 font-bold tracking-widest uppercase">
                [ Results Generated: {generatedList.length} ]
              </p>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white">
                Curated Handles
              </h3>
            </div>

            {loading ? (
              /* Custom beautiful loader screen */
              <div className="py-24 flex flex-col items-center justify-center text-center bg-zinc-900/30 border border-zinc-800/50 rounded-3xl" id="custom-loader-canvas">
                <div className="relative mb-6">
                  {/* Pulse visual ring */}
                  <div className="absolute inset-0 rounded-full w-12 h-12 bg-indigo-500/10 animate-ping" />
                  <div className="w-12 h-12 rounded-full border border-zinc-800/80 flex items-center justify-center bg-zinc-950">
                    <RotateCw className="w-5 h-5 text-indigo-400 animate-spin" />
                  </div>
                </div>
                <h3 className="font-semibold text-zinc-200 text-sm">Synthesizing Curated Handles</h3>
                
                {/* Cycling helpful visual message */}
                <span className="text-xs text-indigo-400/80 font-mono mt-2 animate-pulse inline-block max-w-sm px-4">
                  {GENERATOR_TIPS[loadingTipIndex]}
                </span>
                <p className="text-[11px] text-zinc-600 max-w-[240px] mt-2 leading-relaxed">
                  Analyzing semantic patterns and style signals using server-side Gemini intelligence.
                </p>
              </div>
            ) : (
              /* Staggered result cards grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4" id="results-cards-grid">
                {generatedList.map((item, index) => {
                  const isSaved = savedList.some(saved => saved.username.toLowerCase() === item.username.toLowerCase());
                  return (
                    <UsernameCard
                      key={`${item.username}-${index}`}
                      item={item}
                      isSaved={isSaved}
                      onToggleSave={() => handleToggleSave(item)}
                      onCheckAvailability={() => handleOpenAvailabilityCheck(item.username)}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* Far Right Column: Saved handles desktop drawer */}
          <section className="lg:col-span-3 h-full sticky top-[92px]" id="favorites-panel-wrapper">
            <SavedUsernames
              savedList={savedList}
              onRemove={handleRemoveSaved}
              onCheckAvailability={handleOpenAvailabilityCheck}
              onClearAll={handleClearAllSaved}
            />
          </section>
        </div>
      </main>

      {/* Floating bookmark badge button for toggling drawer on tablets and mobiles */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobileShowFavorites(!mobileShowFavorites)}
          className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          id="mobile-saved-toggle"
        >
          <Bookmark className="w-5 h-5 fill-white/10" />
          <span className="font-semibold text-xs pr-1 font-mono">{savedList.length} Saved</span>
        </button>
      </div>

      {/* Mobile Modal Drawer Overlay for Saved */}
      <AnimatePresence>
        {mobileShowFavorites && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-xs">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setMobileShowFavorites(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm h-full bg-zinc-950 border-l border-zinc-800 p-5 shadow-2xl flex flex-col"
            >
              <button
                onClick={() => setMobileShowFavorites(false)}
                className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-850"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="h-full pt-4">
                <SavedUsernames
                  savedList={savedList}
                  onRemove={handleRemoveSaved}
                  onCheckAvailability={handleOpenAvailabilityCheck}
                  onClearAll={handleClearAllSaved}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verification modal popup */}
      <AvailabilityCheckerModal
        username={selectedUsername || ""}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Small Humble Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/40 py-8 text-center text-[11px] font-mono text-zinc-600 space-y-2 mt-12">
        <p>© 2026 NameCraft Brand Forge. Generates authentic identities without randomized word clashing.</p>
        <p className="opacity-80">Empowered by server-side Gemini 3.5 Flash intelligence.</p>
      </footer>
    </div>
  );
}
