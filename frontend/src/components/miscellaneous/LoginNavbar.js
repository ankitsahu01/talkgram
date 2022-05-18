import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../stateFeatures/loggedUserSlice";
import LightModeLogo from "../../assets/logo_lightmode.png";
import DarkModeLogo from "../../assets/logo_darkmode.png";
import Colormodeswitch from "./ColorModeSwitch";

const LoginNavbar = () => {
  const colorMode = useSelector((state) => state.colorMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    if (!email || !password)
      return toast.warning("Please fill all the fields!");
    try {
      setLoading(true);
      const res = await fetch("/api/user/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await res.json();
      if (res.status === 200) {
        dispatch(setLoggedUser(resData));
        navigate("/chat");
      } else {
        console.log(resData.message);
        toast.error("Invalid Credentials!");
      }
    } catch (err) {
      // console.error(err);
      toast.error("Invalid Credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "background.paper" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img
                src={colorMode === "light" ? LightModeLogo : DarkModeLogo}
                alt="Logo"
                style={{ maxWidth: 130 }}
              />
            </Link>
          </Box>
          <Box sx={{ mx: 2 }}>
            <Colormodeswitch />
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              mr: 2,
            }}
            component="form"
            onSubmit={submitHandler}
          >
            <TextField
              size="small"
              placeholder="Email"
              required
              type="email"
              name="email"
              value={data.emal}
              onChange={handleInput}
            />
            <TextField
              size="small"
              placeholder="Password"
              required
              type="password"
              name="password"
              value={data.password}
              onChange={handleInput}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ width: 70 }}
            >
              {loading ? (
                <CircularProgress color="inherit" size={25} />
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button variant="contained">Login</Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default LoginNavbar;
