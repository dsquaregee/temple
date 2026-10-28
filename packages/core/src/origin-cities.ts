// Curated travel-hub cities for the Discover "Near me" picker: a devotee picks
// the city they're travelling from and temples are ranked by distance from there
// (no device geolocation required). Names are transliterated proper nouns shown
// as-is in every locale — the same policy the catalog uses for place names.
// Coordinates are city centres; distance ranking only needs them to be roughly
// right. Listed alphabetically so a city is easy to find in the dropdown.
export interface OriginCity {
  name: string;
  lat: number;
  lng: number;
}

export const ORIGIN_CITIES: OriginCity[] = [
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Kanchipuram', lat: 12.8342, lng: 79.7036 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Kozhikode', lat: 11.2588, lng: 75.7804 },
  { name: 'Kumbakonam', lat: 10.9617, lng: 79.3881 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  { name: 'Mangaluru', lat: 12.9141, lng: 74.856 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  { name: 'Puducherry', lat: 11.9416, lng: 79.8083 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Rameswaram', lat: 9.2881, lng: 79.3129 },
  { name: 'Salem', lat: 11.6643, lng: 78.146 },
  { name: 'Thanjavur', lat: 10.787, lng: 79.1378 },
  { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
  { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
  { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
  { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
  { name: 'Ujjain', lat: 23.1765, lng: 75.7885 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Vijayawada', lat: 16.5062, lng: 80.648 },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
];

export const ORIGIN_CITY_BY_NAME: Record<string, OriginCity> = Object.fromEntries(
  ORIGIN_CITIES.map((c) => [c.name, c]),
);
