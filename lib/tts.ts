const accentVoiceMap = {
  US: process.env.ELEVENLABS_VOICE_ID_US,
  UK: process.env.ELEVENLABS_VOICE_ID_UK,
  AU: process.env.ELEVENLABS_VOICE_ID_AU
} as const;

export type Accent = keyof typeof accentVoiceMap;

export const supportedAccents = Object.keys(accentVoiceMap) as Accent[];

export function getVoiceIdForAccent(accent: string) {
  const upperAccent = accent.toUpperCase() as Accent;
  return accentVoiceMap[upperAccent];
}
