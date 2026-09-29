// ─────────────────────────────────────────────
//  REGIME DEFINITIONS
// ─────────────────────────────────────────────
export const REGIMES = [
  {
    id: "active_monsoon",
    label: "Active Monsoon",
    icon: "CloudRain",
    color: "#2dd4bf",
    description: "Strong, widespread monsoon precipitation over peninsula & central India",
  },
  {
    id: "break_monsoon",
    label: "Break Monsoon",
    icon: "Sun",
    color: "#d97706",
    description: "Weakened monsoon trough, dry spell over plains, active over Himalayan foothills",
  },
  {
    id: "monsoon_low",
    label: "Monsoon Low / Depression",
    icon: "Wind",
    color: "#c2714f",
    description: "Low pressure / depression in Bay of Bengal causing intense rainfall over east/central India",
  },
  {
    id: "orographic",
    label: "Coastal / Orographic",
    icon: "Mountain",
    color: "#6ee7b7",
    description: "Orographic lifting along Western Ghats / coastal Karnataka & Kerala",
  },
];

// ─────────────────────────────────────────────
//  FORECAST COMPARISON DATA  (hourly 00-72h)
// ─────────────────────────────────────────────
const hrs = Array.from({ length: 13 }, (_, i) => i * 6); // 0,6,12,...72

const forecastByRegime = {
  active_monsoon: {
    raw:       [4, 12, 28, 41, 53, 62, 74, 88, 79, 67, 55, 43, 31],
    corrected: [3,  9, 22, 35, 46, 55, 65, 78, 70, 59, 48, 37, 26],
    observed:  [2,  8, 20, 33, 44, 52, 62, 74, 68, 57, 46, 35, 25],
  },
  break_monsoon: {
    raw:       [1, 3,  8, 14, 18, 22, 19, 15, 11,  7,  5,  3,  2],
    corrected: [1, 2,  6, 10, 14, 16, 14, 11,  8,  5,  3,  2,  1],
    observed:  [0, 2,  5,  9, 12, 15, 13, 10,  7,  4,  3,  2,  1],
  },
  monsoon_low: {
    raw:       [8, 22, 47, 71, 95,112,128,141,119, 98, 77, 56, 38],
    corrected: [6, 18, 39, 60, 80, 96,110,122,103, 84, 66, 48, 32],
    observed:  [5, 16, 36, 57, 76, 91,104,116, 97, 79, 62, 45, 30],
  },
  orographic: {
    raw:       [6, 18, 35, 55, 72, 88,102, 96, 84, 70, 58, 44, 30],
    corrected: [5, 15, 29, 46, 61, 74, 86, 81, 70, 58, 48, 36, 24],
    observed:  [4, 13, 27, 43, 58, 70, 82, 77, 66, 55, 46, 34, 23],
  },
};

export const getForecastData = (regimeId) =>
  hrs.map((h, i) => ({
    hour: `+${h}h`,
    raw: forecastByRegime[regimeId].raw[i],
    corrected: forecastByRegime[regimeId].corrected[i],
    observed: forecastByRegime[regimeId].observed[i],
  }));

// ─────────────────────────────────────────────
//  HEAVY RAINFALL ALERTS
// ─────────────────────────────────────────────
const alertsByRegime = {
  active_monsoon: [
    { region: "Konkan & Goa", threshold: "≥ 115.6 mm (Very Heavy)", prob: 82, level: "red" },
    { region: "Madhya Maharashtra", threshold: "≥ 64.5 mm (Heavy)", prob: 71, level: "orange" },
    { region: "Vidarbha", threshold: "≥ 64.5 mm (Heavy)", prob: 64, level: "orange" },
    { region: "Coastal Karnataka", threshold: "≥ 115.6 mm (Very Heavy)", prob: 78, level: "red" },
    { region: "North Kerala", threshold: "≥ 204.5 mm (Extremely Heavy)", prob: 45, level: "yellow" },
    { region: "South Gujarat", threshold: "≥ 64.5 mm (Heavy)", prob: 55, level: "yellow" },
  ],
  break_monsoon: [
    { region: "Sub-Himalayan West Bengal", threshold: "≥ 64.5 mm (Heavy)", prob: 38, level: "yellow" },
    { region: "Uttarakhand Hills", threshold: "≥ 115.6 mm (Very Heavy)", prob: 42, level: "yellow" },
    { region: "Northeast India", threshold: "≥ 64.5 mm (Heavy)", prob: 29, level: "green" },
    { region: "Gangetic Plains", threshold: "≥ 35.5 mm (Moderate)", prob: 18, level: "green" },
  ],
  monsoon_low: [
    { region: "Odisha", threshold: "≥ 204.5 mm (Extremely Heavy)", prob: 91, level: "red" },
    { region: "Chhattisgarh", threshold: "≥ 115.6 mm (Very Heavy)", prob: 84, level: "red" },
    { region: "Jharkhand", threshold: "≥ 115.6 mm (Very Heavy)", prob: 77, level: "red" },
    { region: "Andhra Pradesh Coast", threshold: "≥ 204.5 mm (Extremely Heavy)", prob: 88, level: "red" },
    { region: "Telangana", threshold: "≥ 115.6 mm (Very Heavy)", prob: 72, level: "orange" },
    { region: "Gangetic West Bengal", threshold: "≥ 115.6 mm (Very Heavy)", prob: 68, level: "orange" },
    { region: "Vidarbha", threshold: "≥ 64.5 mm (Heavy)", prob: 61, level: "orange" },
  ],
  orographic: [
    { region: "South Kerala (Wayanad)", threshold: "≥ 204.5 mm (Extremely Heavy)", prob: 87, level: "red" },
    { region: "Coastal Karnataka (Dakshina Kannada)", threshold: "≥ 115.6 mm (Very Heavy)", prob: 79, level: "red" },
    { region: "North Kerala (Kozhikode)", threshold: "≥ 115.6 mm (Very Heavy)", prob: 73, level: "orange" },
    { region: "Goa (Panaji Ghats)", threshold: "≥ 115.6 mm (Very Heavy)", prob: 65, level: "orange" },
    { region: "Lakshadweep", threshold: "≥ 64.5 mm (Heavy)", prob: 51, level: "yellow" },
  ],
};

export const getAlerts = (regimeId) => alertsByRegime[regimeId] || [];

// ─────────────────────────────────────────────
//  DISTRICT-LEVEL RAINFALL TABLE
// ─────────────────────────────────────────────
const districtsByRegime = {
  active_monsoon: [
    { district: "Andaman and Nicobar City", state: "Andaman and Nicobar", raw: 10, corrected: 9, obs: 7, bias: 2, category: "Extremely Heavy" },
    { district: "Andhra Pradesh City", state: "Andhra Pradesh", raw: 23, corrected: 20, obs: 18, bias: 2, category: "Light" },
    { district: "Arunachal Pradesh City", state: "Arunachal Pradesh", raw: 36, corrected: 31, obs: 29, bias: 2, category: "Very Heavy" },
    { district: "Assam City", state: "Assam", raw: 49, corrected: 42, obs: 40, bias: 2, category: "Extremely Heavy" },
    { district: "Bihar City", state: "Bihar", raw: 62, corrected: 53, obs: 51, bias: 2, category: "Very Heavy" },
    { district: "Chandigarh City", state: "Chandigarh", raw: 75, corrected: 64, obs: 62, bias: 2, category: "Light" },
    { district: "Chhattisgarh City", state: "Chhattisgarh", raw: 88, corrected: 75, obs: 73, bias: 2, category: "Heavy" },
    { district: "New Delhi", state: "Delhi", raw: 101, corrected: 86, obs: 84, bias: 2, category: "Light" },
    { district: "Goa City", state: "Goa", raw: 114, corrected: 97, obs: 95, bias: 2, category: "Extremely Heavy" },
    { district: "Gujarat City", state: "Gujarat", raw: 127, corrected: 108, obs: 106, bias: 2, category: "Very Heavy" },
    { district: "Haryana City", state: "Haryana", raw: 140, corrected: 119, obs: 117, bias: 2, category: "Light" },
    { district: "Himachal Pradesh City", state: "Himachal Pradesh", raw: 153, corrected: 130, obs: 128, bias: 2, category: "Moderate" },
    { district: "Jammu and Kashmir City", state: "Jammu and Kashmir", raw: 166, corrected: 141, obs: 139, bias: 2, category: "Light" },
    { district: "Jharkhand City", state: "Jharkhand", raw: 179, corrected: 152, obs: 150, bias: 2, category: "Heavy" },
    { district: "Karnataka City", state: "Karnataka", raw: 192, corrected: 163, obs: 161, bias: 2, category: "Very Heavy" },
    { district: "Kerala City", state: "Kerala", raw: 205, corrected: 174, obs: 172, bias: 2, category: "Extremely Heavy" },
    { district: "Madhya Pradesh City", state: "Madhya Pradesh", raw: 18, corrected: 15, obs: 13, bias: 2, category: "Moderate" },
    { district: "Maharashtra City", state: "Maharashtra", raw: 31, corrected: 26, obs: 24, bias: 2, category: "Extremely Heavy" },
    { district: "Manipur City", state: "Manipur", raw: 44, corrected: 37, obs: 35, bias: 2, category: "Moderate" },
    { district: "Meghalaya City", state: "Meghalaya", raw: 57, corrected: 48, obs: 46, bias: 2, category: "Extremely Heavy" },
    { district: "Mizoram City", state: "Mizoram", raw: 70, corrected: 60, obs: 58, bias: 2, category: "Heavy" },
    { district: "Nagaland City", state: "Nagaland", raw: 83, corrected: 71, obs: 69, bias: 2, category: "Extremely Heavy" },
    { district: "Odisha City", state: "Odisha", raw: 96, corrected: 82, obs: 80, bias: 2, category: "Light" },
    { district: "Punjab City", state: "Punjab", raw: 109, corrected: 93, obs: 91, bias: 2, category: "Moderate" },
    { district: "Rajasthan City", state: "Rajasthan", raw: 122, corrected: 104, obs: 102, bias: 2, category: "Light" },
    { district: "Sikkim City", state: "Sikkim", raw: 135, corrected: 115, obs: 113, bias: 2, category: "Moderate" },
    { district: "Tamil Nadu City", state: "Tamil Nadu", raw: 148, corrected: 126, obs: 124, bias: 2, category: "Light" },
    { district: "Telangana City", state: "Telangana", raw: 161, corrected: 137, obs: 135, bias: 2, category: "Heavy" },
    { district: "Tripura City", state: "Tripura", raw: 174, corrected: 148, obs: 146, bias: 2, category: "Extremely Heavy" },
    { district: "UP City", state: "UP", raw: 187, corrected: 159, obs: 157, bias: 2, category: "Light" },
    { district: "Uttarakhand City", state: "Uttarakhand", raw: 200, corrected: 170, obs: 168, bias: 2, category: "Moderate" },
    { district: "West Bengal City", state: "West Bengal", raw: 13, corrected: 11, obs: 9, bias: 2, category: "Very Heavy" },
    { district: "Ladakh City", state: "Ladakh", raw: 26, corrected: 22, obs: 20, bias: 2, category: "Moderate" },
  ],
  break_monsoon: [
    { district: "Andaman and Nicobar City", state: "Andaman and Nicobar", raw: 17, corrected: 14, obs: 12, bias: 2, category: "Moderate" },
    { district: "Andhra Pradesh City", state: "Andhra Pradesh", raw: 30, corrected: 26, obs: 24, bias: 2, category: "Very Heavy" },
    { district: "Arunachal Pradesh City", state: "Arunachal Pradesh", raw: 43, corrected: 37, obs: 35, bias: 2, category: "Moderate" },
    { district: "Assam City", state: "Assam", raw: 56, corrected: 48, obs: 46, bias: 2, category: "Light" },
    { district: "Bihar City", state: "Bihar", raw: 69, corrected: 59, obs: 57, bias: 2, category: "Heavy" },
    { district: "Chandigarh City", state: "Chandigarh", raw: 82, corrected: 70, obs: 68, bias: 2, category: "Extremely Heavy" },
    { district: "Chhattisgarh City", state: "Chhattisgarh", raw: 95, corrected: 81, obs: 79, bias: 2, category: "Light" },
    { district: "New Delhi", state: "Delhi", raw: 108, corrected: 92, obs: 90, bias: 2, category: "Moderate" },
    { district: "Goa City", state: "Goa", raw: 121, corrected: 103, obs: 101, bias: 2, category: "Very Heavy" },
    { district: "Gujarat City", state: "Gujarat", raw: 134, corrected: 114, obs: 112, bias: 2, category: "Moderate" },
    { district: "Haryana City", state: "Haryana", raw: 147, corrected: 125, obs: 123, bias: 2, category: "Light" },
    { district: "Himachal Pradesh City", state: "Himachal Pradesh", raw: 160, corrected: 136, obs: 134, bias: 2, category: "Heavy" },
    { district: "Jammu and Kashmir City", state: "Jammu and Kashmir", raw: 173, corrected: 147, obs: 145, bias: 2, category: "Extremely Heavy" },
    { district: "Jharkhand City", state: "Jharkhand", raw: 186, corrected: 158, obs: 156, bias: 2, category: "Light" },
    { district: "Karnataka City", state: "Karnataka", raw: 199, corrected: 169, obs: 167, bias: 2, category: "Moderate" },
    { district: "Kerala City", state: "Kerala", raw: 12, corrected: 10, obs: 8, bias: 2, category: "Very Heavy" },
    { district: "Madhya Pradesh City", state: "Madhya Pradesh", raw: 25, corrected: 21, obs: 19, bias: 2, category: "Moderate" },
    { district: "Maharashtra City", state: "Maharashtra", raw: 38, corrected: 32, obs: 30, bias: 2, category: "Light" },
    { district: "Manipur City", state: "Manipur", raw: 51, corrected: 43, obs: 41, bias: 2, category: "Heavy" },
    { district: "Meghalaya City", state: "Meghalaya", raw: 64, corrected: 54, obs: 52, bias: 2, category: "Extremely Heavy" },
    { district: "Mizoram City", state: "Mizoram", raw: 77, corrected: 65, obs: 63, bias: 2, category: "Light" },
    { district: "Nagaland City", state: "Nagaland", raw: 90, corrected: 77, obs: 75, bias: 2, category: "Moderate" },
    { district: "Odisha City", state: "Odisha", raw: 103, corrected: 88, obs: 86, bias: 2, category: "Very Heavy" },
    { district: "Punjab City", state: "Punjab", raw: 116, corrected: 99, obs: 97, bias: 2, category: "Moderate" },
    { district: "Rajasthan City", state: "Rajasthan", raw: 129, corrected: 110, obs: 108, bias: 2, category: "Light" },
    { district: "Sikkim City", state: "Sikkim", raw: 142, corrected: 121, obs: 119, bias: 2, category: "Heavy" },
    { district: "Tamil Nadu City", state: "Tamil Nadu", raw: 155, corrected: 132, obs: 130, bias: 2, category: "Extremely Heavy" },
    { district: "Telangana City", state: "Telangana", raw: 168, corrected: 143, obs: 141, bias: 2, category: "Light" },
    { district: "Tripura City", state: "Tripura", raw: 181, corrected: 154, obs: 152, bias: 2, category: "Moderate" },
    { district: "UP City", state: "UP", raw: 194, corrected: 165, obs: 163, bias: 2, category: "Very Heavy" },
    { district: "Uttarakhand City", state: "Uttarakhand", raw: 207, corrected: 176, obs: 174, bias: 2, category: "Moderate" },
    { district: "West Bengal City", state: "West Bengal", raw: 20, corrected: 17, obs: 15, bias: 2, category: "Light" },
    { district: "Ladakh City", state: "Ladakh", raw: 33, corrected: 28, obs: 26, bias: 2, category: "Heavy" },
  ],
  monsoon_low: [
    { district: "Andaman and Nicobar City", state: "Andaman and Nicobar", raw: 24, corrected: 20, obs: 18, bias: 2, category: "Moderate" },
    { district: "Andhra Pradesh City", state: "Andhra Pradesh", raw: 37, corrected: 31, obs: 29, bias: 2, category: "Light" },
    { district: "Arunachal Pradesh City", state: "Arunachal Pradesh", raw: 50, corrected: 43, obs: 41, bias: 2, category: "Heavy" },
    { district: "Assam City", state: "Assam", raw: 63, corrected: 54, obs: 52, bias: 2, category: "Extremely Heavy" },
    { district: "Bihar City", state: "Bihar", raw: 76, corrected: 65, obs: 63, bias: 2, category: "Light" },
    { district: "Chandigarh City", state: "Chandigarh", raw: 89, corrected: 76, obs: 74, bias: 2, category: "Moderate" },
    { district: "Chhattisgarh City", state: "Chhattisgarh", raw: 102, corrected: 87, obs: 85, bias: 2, category: "Very Heavy" },
    { district: "New Delhi", state: "Delhi", raw: 115, corrected: 98, obs: 96, bias: 2, category: "Moderate" },
    { district: "Goa City", state: "Goa", raw: 128, corrected: 109, obs: 107, bias: 2, category: "Light" },
    { district: "Gujarat City", state: "Gujarat", raw: 141, corrected: 120, obs: 118, bias: 2, category: "Heavy" },
    { district: "Haryana City", state: "Haryana", raw: 154, corrected: 131, obs: 129, bias: 2, category: "Extremely Heavy" },
    { district: "Himachal Pradesh City", state: "Himachal Pradesh", raw: 167, corrected: 142, obs: 140, bias: 2, category: "Light" },
    { district: "Jammu and Kashmir City", state: "Jammu and Kashmir", raw: 180, corrected: 153, obs: 151, bias: 2, category: "Moderate" },
    { district: "Jharkhand City", state: "Jharkhand", raw: 193, corrected: 164, obs: 162, bias: 2, category: "Very Heavy" },
    { district: "Karnataka City", state: "Karnataka", raw: 206, corrected: 175, obs: 173, bias: 2, category: "Moderate" },
    { district: "Kerala City", state: "Kerala", raw: 19, corrected: 16, obs: 14, bias: 2, category: "Light" },
    { district: "Madhya Pradesh City", state: "Madhya Pradesh", raw: 32, corrected: 27, obs: 25, bias: 2, category: "Heavy" },
    { district: "Maharashtra City", state: "Maharashtra", raw: 45, corrected: 38, obs: 36, bias: 2, category: "Extremely Heavy" },
    { district: "Manipur City", state: "Manipur", raw: 58, corrected: 49, obs: 47, bias: 2, category: "Light" },
    { district: "Meghalaya City", state: "Meghalaya", raw: 71, corrected: 60, obs: 58, bias: 2, category: "Moderate" },
    { district: "Mizoram City", state: "Mizoram", raw: 84, corrected: 71, obs: 69, bias: 2, category: "Very Heavy" },
    { district: "Nagaland City", state: "Nagaland", raw: 97, corrected: 82, obs: 80, bias: 2, category: "Moderate" },
    { district: "Odisha City", state: "Odisha", raw: 110, corrected: 94, obs: 92, bias: 2, category: "Light" },
    { district: "Punjab City", state: "Punjab", raw: 123, corrected: 105, obs: 103, bias: 2, category: "Heavy" },
    { district: "Rajasthan City", state: "Rajasthan", raw: 136, corrected: 116, obs: 114, bias: 2, category: "Extremely Heavy" },
    { district: "Sikkim City", state: "Sikkim", raw: 149, corrected: 127, obs: 125, bias: 2, category: "Light" },
    { district: "Tamil Nadu City", state: "Tamil Nadu", raw: 162, corrected: 138, obs: 136, bias: 2, category: "Moderate" },
    { district: "Telangana City", state: "Telangana", raw: 175, corrected: 149, obs: 147, bias: 2, category: "Very Heavy" },
    { district: "Tripura City", state: "Tripura", raw: 188, corrected: 160, obs: 158, bias: 2, category: "Moderate" },
    { district: "UP City", state: "UP", raw: 201, corrected: 171, obs: 169, bias: 2, category: "Light" },
    { district: "Uttarakhand City", state: "Uttarakhand", raw: 14, corrected: 12, obs: 10, bias: 2, category: "Heavy" },
    { district: "West Bengal City", state: "West Bengal", raw: 27, corrected: 23, obs: 21, bias: 2, category: "Extremely Heavy" },
    { district: "Ladakh City", state: "Ladakh", raw: 40, corrected: 34, obs: 32, bias: 2, category: "Light" },
  ],
  orographic: [
    { district: "Andaman and Nicobar City", state: "Andaman and Nicobar", raw: 31, corrected: 26, obs: 24, bias: 2, category: "Heavy" },
    { district: "Andhra Pradesh City", state: "Andhra Pradesh", raw: 44, corrected: 37, obs: 35, bias: 2, category: "Extremely Heavy" },
    { district: "Arunachal Pradesh City", state: "Arunachal Pradesh", raw: 57, corrected: 48, obs: 46, bias: 2, category: "Light" },
    { district: "Assam City", state: "Assam", raw: 70, corrected: 60, obs: 58, bias: 2, category: "Moderate" },
    { district: "Bihar City", state: "Bihar", raw: 83, corrected: 71, obs: 69, bias: 2, category: "Very Heavy" },
    { district: "Chandigarh City", state: "Chandigarh", raw: 96, corrected: 82, obs: 80, bias: 2, category: "Moderate" },
    { district: "Chhattisgarh City", state: "Chhattisgarh", raw: 109, corrected: 93, obs: 91, bias: 2, category: "Light" },
    { district: "New Delhi", state: "Delhi", raw: 122, corrected: 104, obs: 102, bias: 2, category: "Heavy" },
    { district: "Goa City", state: "Goa", raw: 135, corrected: 115, obs: 113, bias: 2, category: "Extremely Heavy" },
    { district: "Gujarat City", state: "Gujarat", raw: 148, corrected: 126, obs: 124, bias: 2, category: "Light" },
    { district: "Haryana City", state: "Haryana", raw: 161, corrected: 137, obs: 135, bias: 2, category: "Moderate" },
    { district: "Himachal Pradesh City", state: "Himachal Pradesh", raw: 174, corrected: 148, obs: 146, bias: 2, category: "Very Heavy" },
    { district: "Jammu and Kashmir City", state: "Jammu and Kashmir", raw: 187, corrected: 159, obs: 157, bias: 2, category: "Moderate" },
    { district: "Jharkhand City", state: "Jharkhand", raw: 200, corrected: 170, obs: 168, bias: 2, category: "Light" },
    { district: "Karnataka City", state: "Karnataka", raw: 13, corrected: 11, obs: 9, bias: 2, category: "Heavy" },
    { district: "Kerala City", state: "Kerala", raw: 26, corrected: 22, obs: 20, bias: 2, category: "Extremely Heavy" },
    { district: "Madhya Pradesh City", state: "Madhya Pradesh", raw: 39, corrected: 33, obs: 31, bias: 2, category: "Light" },
    { district: "Maharashtra City", state: "Maharashtra", raw: 52, corrected: 44, obs: 42, bias: 2, category: "Moderate" },
    { district: "Manipur City", state: "Manipur", raw: 65, corrected: 55, obs: 53, bias: 2, category: "Very Heavy" },
    { district: "Meghalaya City", state: "Meghalaya", raw: 78, corrected: 66, obs: 64, bias: 2, category: "Moderate" },
    { district: "Mizoram City", state: "Mizoram", raw: 91, corrected: 77, obs: 75, bias: 2, category: "Light" },
    { district: "Nagaland City", state: "Nagaland", raw: 104, corrected: 88, obs: 86, bias: 2, category: "Heavy" },
    { district: "Odisha City", state: "Odisha", raw: 117, corrected: 99, obs: 97, bias: 2, category: "Extremely Heavy" },
    { district: "Punjab City", state: "Punjab", raw: 130, corrected: 111, obs: 109, bias: 2, category: "Light" },
    { district: "Rajasthan City", state: "Rajasthan", raw: 143, corrected: 122, obs: 120, bias: 2, category: "Moderate" },
    { district: "Sikkim City", state: "Sikkim", raw: 156, corrected: 133, obs: 131, bias: 2, category: "Very Heavy" },
    { district: "Tamil Nadu City", state: "Tamil Nadu", raw: 169, corrected: 144, obs: 142, bias: 2, category: "Moderate" },
    { district: "Telangana City", state: "Telangana", raw: 182, corrected: 155, obs: 153, bias: 2, category: "Light" },
    { district: "Tripura City", state: "Tripura", raw: 195, corrected: 166, obs: 164, bias: 2, category: "Heavy" },
    { district: "UP City", state: "UP", raw: 208, corrected: 177, obs: 175, bias: 2, category: "Extremely Heavy" },
    { district: "Uttarakhand City", state: "Uttarakhand", raw: 21, corrected: 18, obs: 16, bias: 2, category: "Light" },
    { district: "West Bengal City", state: "West Bengal", raw: 34, corrected: 29, obs: 27, bias: 2, category: "Moderate" },
    { district: "Ladakh City", state: "Ladakh", raw: 47, corrected: 40, obs: 38, bias: 2, category: "Very Heavy" },
  ],
};

export const getDistrictData = (regimeId) => districtsByRegime[regimeId] || [];

// ─────────────────────────────────────────────
//  VERIFICATION / SKILL SCORES
// ─────────────────────────────────────────────
const verificationByRegime = {
  active_monsoon: {
    summary: { rmse_raw: 18.4, rmse_corrected: 11.2, bias_raw: 12.6, bias_corrected: 1.8 },
    scores: [
      { metric: "ETS", raw: 0.28, corrected: 0.47, label: "Equitable Threat Score" },
      { metric: "CSI", raw: 0.31, corrected: 0.52, label: "Critical Success Index" },
      { metric: "POD", raw: 0.62, corrected: 0.81, label: "Probability of Detection" },
      { metric: "FAR", raw: 0.48, corrected: 0.24, label: "False Alarm Ratio (lower=better)" },
      { metric: "FSS", raw: 0.41, corrected: 0.68, label: "Fractions Skill Score" },
    ],
    daily: [
      { day: "Mon", raw: 22.1, corrected: 13.2, obs: 12.8 },
      { day: "Tue", raw: 28.4, corrected: 16.8, obs: 16.1 },
      { day: "Wed", raw: 35.2, corrected: 20.1, obs: 19.4 },
      { day: "Thu", raw: 41.8, corrected: 23.9, obs: 23.1 },
      { day: "Fri", raw: 38.6, corrected: 22.4, obs: 21.7 },
      { day: "Sat", raw: 32.3, corrected: 18.6, obs: 17.9 },
      { day: "Sun", raw: 25.7, corrected: 14.9, obs: 14.3 },
    ],
  },
  break_monsoon: {
    summary: { rmse_raw: 8.2, rmse_corrected: 4.1, bias_raw: 5.9, bias_corrected: 0.8 },
    scores: [
      { metric: "ETS", raw: 0.18, corrected: 0.38, label: "Equitable Threat Score" },
      { metric: "CSI", raw: 0.22, corrected: 0.44, label: "Critical Success Index" },
      { metric: "POD", raw: 0.45, corrected: 0.72, label: "Probability of Detection" },
      { metric: "FAR", raw: 0.61, corrected: 0.30, label: "False Alarm Ratio (lower=better)" },
      { metric: "FSS", raw: 0.33, corrected: 0.58, label: "Fractions Skill Score" },
    ],
    daily: [
      { day: "Mon", raw: 9.1, corrected: 4.8, obs: 4.5 },
      { day: "Tue", raw: 11.2, corrected: 5.6, obs: 5.2 },
      { day: "Wed", raw: 7.8, corrected: 3.9, obs: 3.6 },
      { day: "Thu", raw: 12.4, corrected: 6.2, obs: 5.9 },
      { day: "Fri", raw: 8.9, corrected: 4.4, obs: 4.1 },
      { day: "Sat", raw: 6.3, corrected: 3.2, obs: 2.9 },
      { day: "Sun", raw: 5.7, corrected: 2.8, obs: 2.6 },
    ],
  },
  monsoon_low: {
    summary: { rmse_raw: 32.8, rmse_corrected: 18.4, bias_raw: 22.1, bias_corrected: 3.2 },
    scores: [
      { metric: "ETS", raw: 0.36, corrected: 0.59, label: "Equitable Threat Score" },
      { metric: "CSI", raw: 0.40, corrected: 0.63, label: "Critical Success Index" },
      { metric: "POD", raw: 0.71, corrected: 0.89, label: "Probability of Detection" },
      { metric: "FAR", raw: 0.42, corrected: 0.18, label: "False Alarm Ratio (lower=better)" },
      { metric: "FSS", raw: 0.52, corrected: 0.78, label: "Fractions Skill Score" },
    ],
    daily: [
      { day: "Mon", raw: 38.2, corrected: 22.1, obs: 21.3 },
      { day: "Tue", raw: 48.6, corrected: 27.8, obs: 26.8 },
      { day: "Wed", raw: 61.4, corrected: 34.9, obs: 33.7 },
      { day: "Thu", raw: 72.1, corrected: 41.2, obs: 39.8 },
      { day: "Fri", raw: 68.8, corrected: 39.4, obs: 38.1 },
      { day: "Sat", raw: 54.3, corrected: 31.1, obs: 30.0 },
      { day: "Sun", raw: 41.9, corrected: 24.2, obs: 23.4 },
    ],
  },
  orographic: {
    summary: { rmse_raw: 28.6, rmse_corrected: 14.8, bias_raw: 19.4, bias_corrected: 2.6 },
    scores: [
      { metric: "ETS", raw: 0.33, corrected: 0.55, label: "Equitable Threat Score" },
      { metric: "CSI", raw: 0.37, corrected: 0.60, label: "Critical Success Index" },
      { metric: "POD", raw: 0.68, corrected: 0.86, label: "Probability of Detection" },
      { metric: "FAR", raw: 0.45, corrected: 0.21, label: "False Alarm Ratio (lower=better)" },
      { metric: "FSS", raw: 0.48, corrected: 0.74, label: "Fractions Skill Score" },
    ],
    daily: [
      { day: "Mon", raw: 34.1, corrected: 17.8, obs: 17.2 },
      { day: "Tue", raw: 42.8, corrected: 22.4, obs: 21.7 },
      { day: "Wed", raw: 54.6, corrected: 28.6, obs: 27.7 },
      { day: "Thu", raw: 63.2, corrected: 33.1, obs: 32.1 },
      { day: "Fri", raw: 59.7, corrected: 31.2, obs: 30.2 },
      { day: "Sat", raw: 48.4, corrected: 25.3, obs: 24.5 },
      { day: "Sun", raw: 37.8, corrected: 19.8, obs: 19.1 },
    ],
  },
};

export const getVerificationData = (regimeId) =>
  verificationByRegime[regimeId] || verificationByRegime.active_monsoon;
