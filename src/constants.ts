export const ZODIAC_SIGNS = [
  { name: 'Aries', date: 'Mar 21 - Apr 19', symbol: '♈' },
  { name: 'Taurus', date: 'Apr 20 - May 20', symbol: '♉' },
  { name: 'Gemini', date: 'May 21 - Jun 20', symbol: '♊' },
  { name: 'Cancer', date: 'Jun 21 - Jul 22', symbol: '♋' },
  { name: 'Leo', date: 'Jul 23 - Aug 22', symbol: '♌' },
  { name: 'Virgo', date: 'Aug 23 - Sep 22', symbol: '♍' },
  { name: 'Libra', date: 'Sep 23 - Oct 22', symbol: '♎' },
  { name: 'Scorpio', date: 'Oct 23 - Nov 21', symbol: '♏' },
  { name: 'Sagittarius', date: 'Nov 22 - Dec 21', symbol: '♐' },
  { name: 'Capricorn', date: 'Dec 22 - Jan 19', symbol: '♑' },
  { name: 'Aquarius', date: 'Jan 20 - Feb 18', symbol: '♒' },
  { name: 'Pisces', date: 'Feb 19 - Mar 20', symbol: '♓' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const INTERESTS_LIST = [
  { id: 'coding', label: 'Coding & Dev', icon: '💻' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'fitness', label: 'Fitness & Health', icon: '💪' },
  { id: 'anime', label: 'Anime & Manga', icon: '🌸' },
  { id: 'business', label: 'Business & Startup', icon: '🚀' },
  { id: 'music', label: 'Music & Production', icon: '🎵' },
  { id: 'design', label: 'Art & Design', icon: '🎨' },
  { id: 'photography', label: 'Photography', icon: '📷' },
  { id: 'science', label: 'Science & Space', icon: '🌌' },
  { id: 'travel', label: 'Travel & Explore', icon: '✈️' },
  { id: 'writing', label: 'Writing & Books', icon: '✍️' },
  { id: 'fashion', label: 'Fashion & Style', icon: '👟' },
];

export const PERSONALITY_TRAITS = [
  { id: 'calm', label: 'Calm & Zen', vibe: 'Peaceful and steady' },
  { id: 'creative', label: 'Creative', vibe: 'Artistic and unique' },
  { id: 'minimalist', label: 'Minimalist', vibe: 'Clean and unpretentious' },
  { id: 'bold', label: 'Bold', vibe: 'Heroic and striking' },
  { id: 'mysterious', label: 'Mysterious', vibe: 'Enigmatic and deep' },
  { id: 'cheerful', label: 'Cheerful', vibe: 'Witty and upbeat' },
  { id: 'technical', label: 'Technical', vibe: 'Logic-driven and precise' },
  { id: 'ambitious', label: 'Ambitious', vibe: 'Motivated and powerful' },
  { id: 'whimsical', label: 'Whimsical', vibe: 'Playful and dreamy' },
  { id: 'stoic', label: 'Stoic', vibe: 'Resilient and focused' },
];

export const STYLE_PREFERENCES = [
  { id: 'Clean', name: 'Clean', desc: 'Modern, balanced, highly readable capitalization patterns.' },
  { id: 'Aesthetic', name: 'Aesthetic', desc: 'Celestial, organic, or abstract flow with ethereal elements.' },
  { id: 'Professional', name: 'Professional', desc: 'Sophisticated, premium, launch-ready freelance & consultant handles.' },
  { id: 'Minimal', name: 'Minimal', desc: 'Ultra-short, letter-focused, sleek and simple combinations.' },
  { id: 'Unique', name: 'Unique', desc: 'Mythological blends, rare root syllables, and custom sci-fi/fantasy concepts.' }
] as const;
