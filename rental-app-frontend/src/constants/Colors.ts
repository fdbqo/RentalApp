const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';


export const rentalAppTheme = {
  primaryDark: "#016180", // Button
  primaryLight: "#1abc9c", // Aqua (Button/Texts)
  primaryDarkPressed: "#01394c", // Pressed Button
  primaryLightPressed: "#159d82", // Aqua Pressed
  backgroundLight: "#fff", // White
  accentDarkRed: "#8B0000", // Black
  textDark: "#000", 
  textLight: "#666",
  secondary: "#4b5563",
  background: "#fff",
  border: "#e2e8f0",
  error: "#ef4444",
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    light: "#94a3b8",
  },
};

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
