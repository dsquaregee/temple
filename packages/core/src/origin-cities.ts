// Curated travel-hub cities for the Discover "Near me" fallback: a devotee who
// won't share GPS (or whose browser blocks it) can instead pick the city they're
// travelling from, and temples are ranked by distance from there. Names are
// transliterated proper nouns shown as-is in every locale — the same policy the
// catalog uses for place names. Coordinates are city centres; distance ranking
// only needs them to be roughly right. Ordered roughly south-to-north so the
// Tamil-heavy catalogue's common origins lead.
export interface OriginCity {
  name: string;
  lat: number;
  lng: number;
}

export const ORIGIN_CITIES: OriginCity[] = [
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kanchipuram', lat: 12.8342, lng: 79.7036 },
  { name: 'Puducherry', lat: 11.9416, lng: 79.8083 },
  { name: 'Thanjavur', lat: 10.787, lng: 79.1378 },
  { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Salem', lat: 11.6643, lng: 78.146 },
  { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
  { name: 'Vijayawada', lat: 16.5062, lng: 80.648 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Delhi', lat: 28.6139, lng: 77.209 },
];

export const ORIGIN_CITY_BY_NAME: Record<string, OriginCity> = Object.fromEntries(
  ORIGIN_CITIES.map((c) => [c.name, c]),
);
