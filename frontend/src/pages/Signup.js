import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "../stateFeatures/loggedUserSlice";
import LoginNavbar from "../components/miscellaneous/LoginNavbar";
import OtpBox from "../components/authentication/OtpBox";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);
  const [openOtpBox, setOpenOtpBox] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);

  const [userNameInputColor, setUserNameInputColor] = useState("primary");

  const [data, setData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUsername = async (e) => {
    if (/ /.test(e.target.value)) {
      e.target.value = e.target.value.replace(/ /g, "");
    }
    handleInput(e);
    if (e.target.value === "") return;
    const res = await fetch(
      "/api/user/search-available-username?q=" + e.target.value
    );
    const resData = await res.json();
    if (resData.success) {
      //username available
      document.getElementById("username-helper-text").style.visibility =
        "hidden";
      setUserNameInputColor("success");
    } else {
      //username already taken
      document.getElementById("username-helper-text").style.visibility =
        "visible";
      setUserNameInputColor("error");
    }
  };

  const handlePic = async (e) => {
    try {
      setLoading(true);
      const pic = e.target.files[0];
      const twoMbToBytes = 2 * 1024 * 1024; // 2MB
      if (pic.type === "image/png" || pic.type === "image/jpeg") {
        if (pic.size > twoMbToBytes) {
          toast.warning("Size should be less than 2mb!");
          e.target.value = null;
          return;
        }
        const postData = new FormData();
        postData.append("file", pic);
        postData.append("upload_preset", "chat-app");
        postData.append("cloud_name", "ankitsahu");
        const url = "https://api.cloudinary.com/v1_1/ankitsahu/image/upload";
        const res = await fetch(url, { method: "POST", body: postData });
        const resData = await res.json();
        const picUrl = resData.url.toString() || "";
        setData({ ...data, pic: picUrl });
      } else {
        toast.warning("Only JPG/PNG Image Allowed!");
        e.target.value = null;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      if (resData.success) {
        setData({
          fullname: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        document.getElementById("pic").value = null;
        dispatch(setLoggedUser(resData));
        navigate("/chat");
      } else toast.error(resData.message);
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isOtpValid) return;
    registerUser();
  }, [isOtpValid]);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { fullname, username, email, password, confirmPassword } = data;
      if (!fullname || !username || !email || !password || !confirmPassword)
        return toast.warning("Please fill all the fields!");

      if (userNameInputColor === "error") {
        toast.error("Enter a unique username!");
        return document.getElementById("username").focus();
      }

      if (password !== confirmPassword)
        return toast.warning("Password not matching!");

      if (password.length <= 5)
        return toast.error("Password should more than 5 characters");

      const res = await fetch("/api/user/is-email-exist", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const isEmailExist = await res.json();
      if (isEmailExist.success) return toast.error("User already exist!");

      setOpenOtpBox(true);
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LoginNavbar />
        <Grid
          container
          alignContent={{ xs: "flex-start", md: "flex-start" }}
          justifyContent="center"
          gap={{ xs: 1, md: 8 }}
          sx={{ mt: { xs: 4, md: 15 }, p: 1, mb: 3 }}
        >
          <Grid item sm={7} md={4} alignSelf={"center"}>
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
                TalkGram helps you connect and share with the people in your
                life.
              </Typography>
            </Box>
          </Grid>
          <Grid item sm={8} md={4}>
            <Paper
              component="form"
              onSubmit={submitHandler}
              elevation={5}
              sx={{ p: 3, borderRadius: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    autoComplete="name"
                    name="fullname"
                    required
                    fullWidth
                    id="fullname"
                    label="Full Name"
                    autoFocus
                    value={data.fullname}
                    onChange={handleInput}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    color={userNameInputColor}
                    value={data.username}
                    focused={data.username === "" ? false : true}
                    onChange={handleUsername}
                  />
                  <FormHelperText
                    error
                    id="username-helper-text"
                    sx={{ visibility: "hidden" }}
                  >
                    {data.username ? "Username already taken!" : " "}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={data.emal}
                    onChange={handleInput}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="contained-button-file" shrink>
                      Upload your Picture
                    </InputLabel>
                    <OutlinedInput
                      id="pic"
                      type="file"
                      inputProps={{ accept: "image/*" }}
                      label="Upload your Picture"
                      notched
                      name="pic"
                      onChange={handlePic}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading === true ? (
                  <CircularProgress sx={{ color: "grey.500" }} size={25} />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {openOtpBox && data.email && (
        <OtpBox
          open={openOtpBox}
          setOpen={setOpenOtpBox}
          email={data.email}
          setIsOtpValid={setIsOtpValid}
          otpSubject="Account verification - by TalkGram"
        />
      )}
    </>
  );
};

export default Signup;
