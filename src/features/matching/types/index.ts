export interface MatchData {
  mainImage?: string;
  info?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
  secondaryImages?: [string?, string?];
}

export interface MatchPageProps {
  matchData?: MatchData;
}
