import { createTheme } from "@mui/material/styles";

// Monotone, minimal theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#424242", // gray-700
      light: "#616161", // gray-600
      dark: "#212121", // gray-900
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#757575", // gray-500
      light: "#9e9e9e", // gray-400
      dark: "#424242", // gray-700
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    divider: "#e0e0e0",
  },
  typography: {
    fontFamily:
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.5rem",
      color: "#212121",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "#212121",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      color: "#212121",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#212121",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      color: "#212121",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      color: "#212121",
    },
    body1: {
      fontSize: "1rem",
      color: "#424242",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#757575",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

export default theme;
