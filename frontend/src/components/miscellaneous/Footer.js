import FavoriteIcon from "@mui/icons-material/Favorite";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";

const randColorCode = () => {
  return Math.floor(Math.random() * 256);
};

const Footer = () => {
  const [color, setColor] = useState("maroon");
  const changeHeartColor = () => {
    setColor(`rgb(${randColorCode()},${randColorCode()},${randColorCode()})`);
  };
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "background.footer",
        mt: "auto",
      }}
    >
      <Toolbar disableGutters sx={{ p: 0.5 }}>
        <IconButton
          sx={{ m: "auto", p: 2, display: "flex", flexDirection: "column" }}
          onClick={changeHeartColor}
        >
          <FavoriteIcon sx={{ color }} />
          <Typography>Made with love - By Ankit Sahu</Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
