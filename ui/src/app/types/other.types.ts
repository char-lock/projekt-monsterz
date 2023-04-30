export type LeaderboardEntry = {
  username: string;
  percent: number;
  score: number;
};

export type ValidationRule = {
  check: (input: string) => boolean;
  description: string 
};
