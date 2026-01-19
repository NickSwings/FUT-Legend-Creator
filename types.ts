export enum Position {
  GK = 'GK',
  CB = 'CB',
  LB = 'LB',
  RB = 'RB',
  CDM = 'CDM',
  CM = 'CM',
  CAM = 'CAM',
  LM = 'LM',
  RM = 'RM',
  LW = 'LW',
  RW = 'RW',
  CF = 'CF',
  ST = 'ST'
}

export interface PlayerAttributes {
  PAC: number;
  SHO: number;
  PAS: number;
  DRI: number;
  DEF: number;
  PHY: number;
}

export interface PlayerData {
  name: string;
  rating: number;
  position: Position;
  clubName: string;
  clubLogoUrl: string | null;
  kitName: string; // The name on the back of the jersey
  jerseyNumber: number;
  nationality: string; // Country Code (e.g., 'AR' for Argentina, 'IN' for India)
  attributes: PlayerAttributes;
  playerImage: string | null; // Base64 of the generated or uploaded image
}

export const COUNTRIES = [
  { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' },
  { code: 'HR', name: 'Croatia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'GB', name: 'England' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' },
  { code: 'MA', name: 'Morocco' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Spain' },
  { code: 'KR', name: 'South Korea' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
];

export const INITIAL_ATTRIBUTES: PlayerAttributes = {
  PAC: 0,
  SHO: 0,
  PAS: 0,
  DRI: 0,
  DEF: 0,
  PHY: 0,
};