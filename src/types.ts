export interface UserSignals {
  name: string;
  birthMonth: string;
  zodiac: string;
  interests: string[];
  personality: string[];
  stylePreference: 'Clean' | 'Aesthetic' | 'Professional' | 'Minimal' | 'Unique';
}

export interface GeneratedUsername {
  username: string;
  meaning: string;
  style: string;
  suitability: string;
}

export interface SavedUsername {
  id: string;
  username: string;
  meaning: string;
  style: string;
  suitability: string;
  savedAt: string;
}

export interface PlatformStatus {
  available: boolean;
  url: string;
  confirmed: boolean;
}

export interface AvailabilityResults {
  github?: PlatformStatus;
  devto?: PlatformStatus;
  reddit?: PlatformStatus;
  twitch?: PlatformStatus;
}
