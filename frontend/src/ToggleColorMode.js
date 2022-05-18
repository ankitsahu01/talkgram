import { green, yellow } from "@mui/material/colors";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import Paper from "@mui/material/Paper";

const getDesign = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#0336FF",
          },
          background: {
            paper: "#DCFDF6",
            footer: "#9dcac0",
            // light: "#fff",
            // dark: "#212121",
          },
          appBackground: "#c4fcf0",
          success: {
            main: green["A700"],
          },
        }
      : {
          primary: {
            main: yellow[600],
          },
        }),
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif", "-apple-system"].join(","),
    ...(mode === "dark"
      ? {
          fontWeightRegular: 300,
        }
      : {}),
  },
});

const ToggleColorMode = ({ children }) => {
  const colorMode = useSelector((state) => state.colorMode);
  const theme = useMemo(
    () => responsiveFontSizes(createTheme(getDesign(colorMode))),
    [colorMode]
  );
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          square
          sx={{
            bgcolor: theme.palette.appBackground,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {children}
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default ToggleColorMode;
