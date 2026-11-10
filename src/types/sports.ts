export type SportType = 'football' | 'hockey' | 'basketball' | 'tennis' | 'cricket';

export type MatchStatus = 'NOT_STARTED' | 'LIVE' | 'HALF_TIME' | 'FULL_TIME' | 'POSTPONED';

export interface MatchEvent {
  id: string;
  minute: number;
  addedTime?: number;
  type: 'goal' | 'penalty' | 'own_goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var';
  team: 'home' | 'away';
  player: string;
  assist?: string;
  playerOut?: string; // for substitutions
  description?: string;
  scoreAfter?: { home: number; away: number };
}

export interface MatchStats {
  possession: { home: number; away: number }; // percentage
  totalShots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  shotsOffTarget: { home: number; away: number };
  blockedShots: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  offsides: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  goalkeeperSaves: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number }; // percentage
  dangerousAttacks: { home: number; away: number };
  expectedGoals: { home: number; away: number }; // xG
}

export interface LineupPlayer {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  gridPos?: { x: number; y: number }; // percentage on pitch: x = 0-100, y = 0-100
  rating?: number;
  isCaptain?: boolean;
  cards?: ('yellow' | 'red')[];
  goals?: number;
  substitutedIn?: number;
  substitutedOut?: number;
}

export interface TeamLineup {
  formation: string; // e.g. "4-3-3", "4-2-3-1"
  manager: string;
  startingXI: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  logo: string;
  country: string;
  sport: SportType;
  color: string;
  stadium?: string;
  founded?: number;
  leaguePosition?: number;
  recentForm?: ('W' | 'D' | 'L')[];
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  nationality: string;
  age: number;
  position: string;
  shirtNumber: number;
  photo: string;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  marketValue?: string;
}

export interface HeadToHeadMeeting {
  id: string;
  date: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface Match {
  id: string;
  sport: SportType;
  competitionId: string;
  competitionName: string;
  competitionRound?: string;
  country: string;
  countryFlag?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: MatchStatus;
  minute?: number;
  addedTime?: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  halfTimeScore?: { home: number; away: number };
  events: MatchEvent[];
  stats: MatchStats;
  lineups?: {
    home: TeamLineup;
    away: TeamLineup;
  };
  commentary: {
    minute: number;
    text: string;
    isImportant?: boolean;
    type?: 'goal' | 'card' | 'sub' | 'chance' | 'info';
  }[];
  h2h?: {
    homeWins: number;
    draws: number;
    awayWins: number;
    previousMatches: HeadToHeadMeeting[];
  };
  venue?: string;
  referee?: string;
  odds?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  aiPrediction?: {
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
    predictedScore: string;
    analysis: string;
  };
}

export interface Competition {
  id: string;
  name: string;
  sport: SportType;
  country: string;
  flag?: string;
  logo?: string;
  priority: number;
}

export interface StandingRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  statusZone?: 'champions_league' | 'europa_league' | 'conference_league' | 'relegation';
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Home' | 'Football' | 'Predictions' | 'Premier League' | 'Transfers' | 'Daily Roundups';
  author: string;
  publisher: string;
  publishedAt: string;
  imageUrl: string;
  readTime: string;
  tags: string[];
}
