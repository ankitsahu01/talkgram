import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setLoggedUser } from "../stateFeatures/loggedUserSlice";
import ColorModeSwitch from "../components/miscellaneous/ColorModeSwitch";

const Login = () => {
  const colorMode = useSelector((state) => state.colorMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { email, password } = data;
      if (!email || !password)
        return toast.warning("Please fill all the fields!");
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
    } finally {
      setLoading(false);
    }
  };

  const loginTestUser = (e) => {
    switch (e.target.name) {
      case "testUserOne":
        setData({ email: "testuser1@gmail.com", password: "123456" });
        break;
      case "testUserTwo":
        setData({ email: "testuser2@gmail.com", password: "123456" });
        break;
      default:
        toast.error("Something went wrong, Try later");
    }
  };

  return (
    <>
      <Grid
        container
        alignContent={{ xs: "flex-start", md: "flex-start" }}
        justifyContent="center"
        gap={{ xs: 1, md: 8 }}
        sx={{ mt: { xs: 2, md: 15 }, p: 1, mb: 3 }}
      >
        <Grid item sm={6} md={4} alignSelf={"center"}>
          <ColorModeSwitch />
          <Box>
            <Typography
              variant="h2"
              component="h1"
              color="primary"
              sx={{ fontWeight: "bold" }}
              textAlign={{ xs: "center", md: "left" }}
            >
              TalkGram
            </Typography>
            <Typography
              variant="h5"
              paragraph
              textAlign={{ xs: "center", md: "left" }}
            >
              TalkGram helps you connect and share with the people in your life.
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={6} md={3}>
          <Paper
            component="form"
            onSubmit={submitHandler}
            elevation={5}
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPwd ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={data.password}
                  onChange={handleInput}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={() => setShowPwd(!showPwd)}
                      >
                        <IconButton>
                          {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Link
              to="/forgot-password"
              style={{
                marginTop: 10,
                float: "right",
                textDecoration: "none",
                color: colorMode === "dark" ? "#fff" : "darkblue",
              }}
            >
              Forgot Password?
            </Link>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ my: 2 }}
            >
              {loading === true ? (
                <CircularProgress sx={{ color: "grey.500" }} size={25} />
              ) : (
                "Login"
              )}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              href={
                process.env.NODE_ENV === "production"
                  ? "https://talkgram.herokuapp.com/auth/google/url"
                  : "http://localhost:4000/auth/google/url"
              }
              startIcon={<GoogleIcon />}
            >
              Continue with Google
            </Button>

            <Grid container spacing={1} sx={{ mt: 0.3 }}>
              <Grid item xs={12} md={6}>
                <Tooltip title="Login Test User 1" arrow>
                  <Button
                    variant="outlined"
                    fullWidth
                    name="testUserOne"
                    onClick={loginTestUser}
                  >
                    Test User 1
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={12} md={6}>
                <Tooltip title="Login Test User 2" arrow>
                  <Button
                    variant="outlined"
                    fullWidth
                    name="testUserTwo"
                    onClick={loginTestUser}
                  >
                    Test User 2
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 3, mb: 3 }} />
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="success" fullWidth>
                Create New Account
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
