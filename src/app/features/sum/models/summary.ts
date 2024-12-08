export interface Summary {
  aspect: string;
  score: number;
  weight: number;
  finalScore: number;
}

export interface SummaryData {
  attitudeSkillSummary: Summary[];
  achievementSummary: Summary[];
  totalPercentage: number;
  totalScore: number;
}
