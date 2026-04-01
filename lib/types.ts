export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  createdAt: number;
  points: number;
  totalBumps: number;
  uniquePeople: number;
  achievements: string[];
}
