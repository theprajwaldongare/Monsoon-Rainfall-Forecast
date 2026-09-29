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
    { district: "Mumbai", state: "Maharashtra", raw: 92, corrected: 80, obs: 78, bias: 14, category: "Very Heavy" },
    { district: "Pune", state: "Maharashtra", raw: 62, corrected: 54, obs: 51, bias: 11, category: "Heavy" },
    { district: "Kolhapur", state: "Maharashtra", raw: 108, corrected: 95, obs: 92, bias: 16, category: "Very Heavy" },
    { district: "Mangaluru", state: "Karnataka", raw: 118, corrected: 103, obs: 99, bias: 19, category: "Very Heavy" },
    { district: "Kozhikode", state: "Kerala", raw: 87, corrected: 76, obs: 73, bias: 14, category: "Heavy" },
    { district: "Thrissur", state: "Kerala", raw: 71, corrected: 62, obs: 60, bias: 11, category: "Heavy" },
    { district: "Panaji", state: "Goa", raw: 131, corrected: 114, obs: 110, bias: 21, category: "Extremely Heavy" },
    { district: "Valsad", state: "Gujarat", raw: 55, corrected: 48, obs: 46, bias: 9, category: "Heavy" },
    { district: "Ratnagiri", state: "Maharashtra", raw: 144, corrected: 126, obs: 122, bias: 22, category: "Extremely Heavy" },
    { district: "Nashik", state: "Maharashtra", raw: 48, corrected: 41, obs: 39, bias: 9, category: "Moderate" },
    { district: "Satara", state: "Maharashtra", raw: 78, corrected: 68, obs: 65, bias: 13, category: "Heavy" },
    { district: "Udupi", state: "Karnataka", raw: 122, corrected: 106, obs: 103, bias: 19, category: "Extremely Heavy" },
  ],
  break_monsoon: [
    { district: "Darjeeling", state: "West Bengal", raw: 54, corrected: 45, obs: 43, bias: 11, category: "Heavy" },
    { district: "Jalpaiguri", state: "West Bengal", raw: 48, corrected: 40, obs: 38, bias: 10, category: "Moderate" },
    { district: "Pithoragarh", state: "Uttarakhand", raw: 62, corrected: 52, obs: 50, bias: 12, category: "Heavy" },
    { district: "Chamoli", state: "Uttarakhand", raw: 44, corrected: 36, obs: 34, bias: 10, category: "Moderate" },
    { district: "Tawang", state: "Arunachal Pradesh", raw: 38, corrected: 31, obs: 29, bias: 9, category: "Moderate" },
    { district: "Dibrugarh", state: "Assam", raw: 29, corrected: 23, obs: 21, bias: 8, category: "Light" },
    { district: "Varanasi", state: "UP", raw: 12, corrected: 8, obs: 7, bias: 5, category: "Light" },
    { district: "Patna", state: "Bihar", raw: 9, corrected: 6, obs: 5, bias: 4, category: "Light" },
  ],
  monsoon_low: [
    { district: "Bhubaneswar", state: "Odisha", raw: 198, corrected: 172, obs: 166, bias: 32, category: "Extremely Heavy" },
    { district: "Puri", state: "Odisha", raw: 221, corrected: 192, obs: 185, bias: 36, category: "Extremely Heavy" },
    { district: "Cuttack", state: "Odisha", raw: 184, corrected: 160, obs: 154, bias: 30, category: "Extremely Heavy" },
    { district: "Raipur", state: "Chhattisgarh", raw: 142, corrected: 123, obs: 118, bias: 24, category: "Very Heavy" },
    { district: "Jagdalpur", state: "Chhattisgarh", raw: 128, corrected: 111, obs: 107, bias: 21, category: "Very Heavy" },
    { district: "Ranchi", state: "Jharkhand", raw: 118, corrected: 102, obs: 98, bias: 20, category: "Very Heavy" },
    { district: "Visakhapatnam", state: "Andhra Pradesh", raw: 211, corrected: 183, obs: 177, bias: 34, category: "Extremely Heavy" },
    { district: "Kakinada", state: "Andhra Pradesh", raw: 196, corrected: 170, obs: 164, bias: 32, category: "Extremely Heavy" },
    { district: "Hyderabad", state: "Telangana", raw: 112, corrected: 97, obs: 93, bias: 19, category: "Very Heavy" },
    { district: "Kolkata", state: "West Bengal", raw: 98, corrected: 85, obs: 82, bias: 16, category: "Heavy" },
    { district: "Nagpur", state: "Maharashtra", raw: 88, corrected: 76, obs: 73, bias: 15, category: "Heavy" },
  ],
  orographic: [
    { district: "Wayanad", state: "Kerala", raw: 218, corrected: 189, obs: 183, bias: 35, category: "Extremely Heavy" },
    { district: "Idukki", state: "Kerala", raw: 192, corrected: 166, obs: 161, bias: 31, category: "Extremely Heavy" },
    { district: "Malappuram", state: "Kerala", raw: 148, corrected: 128, obs: 124, bias: 24, category: "Extremely Heavy" },
    { district: "Dakshina Kannada", state: "Karnataka", raw: 168, corrected: 146, obs: 141, bias: 27, category: "Extremely Heavy" },
    { district: "Kodagu", state: "Karnataka", raw: 184, corrected: 159, obs: 154, bias: 30, category: "Extremely Heavy" },
    { district: "North Goa", state: "Goa", raw: 122, corrected: 106, obs: 102, bias: 20, category: "Very Heavy" },
    { district: "Ratnagiri", state: "Maharashtra", raw: 156, corrected: 135, obs: 131, bias: 25, category: "Extremely Heavy" },
    { district: "Kannur", state: "Kerala", raw: 138, corrected: 120, obs: 116, bias: 22, category: "Very Heavy" },
    { district: "Kasaragod", state: "Kerala", raw: 145, corrected: 126, obs: 122, bias: 23, category: "Very Heavy" },
    { district: "Uttara Kannada", state: "Karnataka", raw: 161, corrected: 140, obs: 135, bias: 26, category: "Extremely Heavy" },
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
