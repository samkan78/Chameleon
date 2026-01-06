export type ChameleonMood = "happy" | "neutral" | "angry" | "sick";
export type ChameleonSpecies = "panther" | "jackson" | "nose-horned";

export interface ChameleonStats {
  energy: number;
  hunger: number;
  happiness: number;
  health: number;
  hydration: number;
}

const MOOD_THRESHOLDS = {
  HEALTH_SICK: 30,
  STAT_CRITICAL: 30,
  STAT_HIGH: 70,
  HAPPINESS_VERY_LOW: 25,
  HAPPINESS_MODERATE: 50,
  CRITICAL_STATS_FOR_ANGRY: 2,
  HIGH_STATS_FOR_HAPPY: 3,
} as const;

export const calcMood = (stats: ChameleonStats): ChameleonMood => {
  const { energy, hunger, happiness, health, hydration } = stats;

  // Priority 1: Sick when health is critically low
  if (health < MOOD_THRESHOLDS.HEALTH_SICK) {
    return "sick";
  }

  // Priority 2: Angry when multiple stats are critical or happiness is very low
  const criticalStatsCount = [energy, hunger, happiness, hydration].filter(
    (stat) => stat < MOOD_THRESHOLDS.STAT_CRITICAL
  ).length;

  const isVeryUnhappy = happiness < MOOD_THRESHOLDS.HAPPINESS_VERY_LOW;
  const hasMultipleCriticalStats =
    criticalStatsCount >= MOOD_THRESHOLDS.CRITICAL_STATS_FOR_ANGRY;

  if (hasMultipleCriticalStats || isVeryUnhappy) {
    return "angry";
  }

  // Priority 3: Happy when most stats are high and happiness is moderate
  const highStatsCount = [energy, hunger, happiness, health, hydration].filter(
    (stat) => stat >= MOOD_THRESHOLDS.STAT_HIGH
  ).length;

  const hasModerateHappiness = happiness >= MOOD_THRESHOLDS.HAPPINESS_MODERATE;
  const hasMostStatsHigh =
    highStatsCount >= MOOD_THRESHOLDS.HIGH_STATS_FOR_HAPPY;

  if (hasMostStatsHigh && hasModerateHappiness) {
    return "happy";
  }

  // Default: Neutral for all other cases
  return "neutral";
};

const CHAMELEON_IMAGES: Record<
  ChameleonSpecies,
  Record<ChameleonMood, string>
> = {
  panther: {
    happy: "/images/panther-yellow.png",
    neutral: "/images/panther-brown.png",
    angry: "/images/panther-orange-red.png",
    sick: "/images/panther-grey.png",
  },
  jackson: {
    happy: "/images/jackson-yellow.png",
    neutral: "/images/jackson-brown.png",
    angry: "/images/jackson-orange-red.png",
    sick: "/images/jackson-grey.png",
  },
  "nose-horned": {
    happy: "/images/nose-horned-yellow.png",
    neutral: "/images/nose-horned-brown.png",
    angry: "/images/nose-horned-orange-red.png",
    sick: "/images/nose-horned-grey.png",
  },
};

export const getChameleonImage = (
  species: ChameleonSpecies,
  mood: ChameleonMood
): string => {
  return CHAMELEON_IMAGES[species][mood];
};
