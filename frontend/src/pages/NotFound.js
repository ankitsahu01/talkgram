import { NavLink } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const NotFound = () => {
  return (
    <Container sx={{ minHeight: "80vh", pt: 10 }}>
      <Typography
        variant="h1"
        component="h1"
        color="primary"
        align="center"
        sx={{ fontSize: { xs: "9em", md: "15em" }, opacity: 0.2 }}
      >
        404
      </Typography>
      <Typography paragraph align="center">
        We're sorry, the page you requested could not be found.
        <br />
        <br />
        <Button
          component={NavLink}
          to="/"
          startIcon={<KeyboardBackspaceIcon />}
          color="primary"
        >
          Back To Home
        </Button>
      </Typography>
    </Container>
  );
};

export default NotFound;
