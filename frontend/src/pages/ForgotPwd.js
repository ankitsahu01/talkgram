import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import OtpBox from "../components/authentication/OtpBox";
import LoginNavbar from "../components/miscellaneous/LoginNavbar";

const ForgotPwd = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);
  const [openOtpBox, setOpenOtpBox] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);

  const handleInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleEmailForm = async (e) => {
    e.preventDefault();
    if (!data.email) return toast.error("Please fill the email field");
    try {
      setLoading(true);
      const res = await fetch("/api/user/is-email-exist", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      if (!resData.success) return toast.error("User not exist");
      setOpenOtpBox(true);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, try later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePwdForm = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = data;
    if (!email || !password || !confirmPassword)
      return toast.warning("Please fill all the fields!");

    if (password !== confirmPassword)
      return toast.warning("Password not matching!");

    if (password.length <= 5)
      return toast.error("Password should more than 5 characters");

    try {
      setLoading(true);
      const res = await fetch("/api/user/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: data.email, password: data.password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      console.log(resData);
      if (resData.success)
        toast.success("You have successfully changed your password.");
      else toast.error("Unable to change password");
      reset();
    } catch (err) {
      console.log(err);
      toast.error("Unable to change password");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData({ email: "", password: "", confirmPassword: "" });
    setIsOtpValid(false);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LoginNavbar />
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Paper
            elevation={4}
            sx={{ borderRadius: 3, mt: 15 }}
            component="form"
            onSubmit={isOtpValid ? handlePwdForm : handleEmailForm}
          >
            <Typography variant="h5" component="h1" sx={{ px: 3, py: 2 }}>
              Find Your Account
            </Typography>
            <Divider />
            <Box sx={{ px: 3, py: 2, height: 180 }}>
              <Typography variant="subtitle1" paragraph>
                {isOtpValid ? (
                  <>
                    Please fill both the fields to change the password for{" "}
                    {data.email}{" "}
                    <Button size="small" onClick={reset}>
                      Change
                    </Button>
                  </>
                ) : (
                  "Please enter your email to search for your account."
                )}
              </Typography>
              {isOtpValid ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPwd ? "text" : "password"}
                      id="password"
                      autoComplete="new-password"
                      autoFocus
                      value={data.password}
                      onChange={handleInput}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={() => setShowPwd(!showPwd)}
                          >
                            <IconButton>
                              {showPwd ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showCpwd ? "text" : "password"}
                      id="confirmPassword"
                      value={data.confirmPassword}
                      onChange={handleInput}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={() => setShowCpwd(!showCpwd)}
                          >
                            <IconButton>
                              {showCpwd ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <TextField
                    type="email"
                    fullWidth
                    placeholder="Enter your email address"
                    name="email"
                    autoFocus
                    value={data.email}
                    onChange={handleInput}
                  />
                </Box>
              )}
            </Box>
            <Divider />
            <LinearProgress
              sx={{
                visibility: loading ? "visible" : "hidden",
              }}
            />
            <Box
              sx={{
                px: 3,
                py: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button variant="outlined" startIcon={<ArrowBackIcon />}>
                  Signup
                </Button>
              </Link>
              <Button variant="contained" type="submit" disabled={loading}>
                {isOtpValid ? "Change" : "Proceed"}
              </Button>
            </Box>
          </Paper>
          {openOtpBox && data.email && (
            <OtpBox
              open={openOtpBox}
              setOpen={setOpenOtpBox}
              email={data.email}
              setIsOtpValid={setIsOtpValid}
              otpSubject="Forgot password verification code - by TalkGram"
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default ForgotPwd;
