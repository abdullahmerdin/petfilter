const PET_EMOJI_MAP: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  fish: "🐟",
  small_pet: "🐹",
  rabbit: "🐇",
  reptile: "🦎",
  horse: "🐴",
};

const DEFAULT_EMOJI = "🐾";

export function getPetEmoji(petType: string | null | undefined): string {
  if (!petType) return DEFAULT_EMOJI;
  return PET_EMOJI_MAP[petType.toLowerCase()] ?? DEFAULT_EMOJI;
}
