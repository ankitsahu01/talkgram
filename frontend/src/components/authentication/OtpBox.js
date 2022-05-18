import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const OtpBox = ({ open, setOpen, email, setIsOtpValid, otpSubject }) => {
  const [resendAttempt, setResendAttempt] = useState(1);
  const [otp, setOtp] = useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
  });

  const sendOtp = async () => {
    await fetch("/api/mailer/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, otpSubject }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  useEffect(() => {
    sendOtp();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const enteredOtp = parseInt(
      `${otp.first}${otp.second}${otp.third}${otp.fourth}`
    );

    const res = await fetch("/api/mailer/validate-otp", {
      method: "POST",
      body: JSON.stringify({ email, enteredOtp }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const isValidate = await res.json();

    if (isValidate.success) {
      toast.success("Otp verified");
      handleClose();
      setIsOtpValid(true);
    } else toast.error("Incorrect otp");
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (value && !value.match(/[0-9]/)) return;
    setOtp({ ...otp, [name]: value });
  };

  const handleClick = (e) => {
    let name = e.target.name;
    let id = e.target.id;
    let pressedKey = e.key;

    if (!/[0-9]|(Backspace)/.test(pressedKey)) return;

    let focusId = parseInt(id);
    if (pressedKey === "Backspace") focusId -= 1;
    else {
      if (otp[name] !== pressedKey) setOtp({ ...otp, [name]: pressedKey });
      focusId += 1;
    }

    if (focusId >= 1 && focusId <= 4)
      document.getElementById(focusId.toString()).focus();
  };

  const handleResend = () => {
    if (resendAttempt >= 3) return;
    sendOtp();
    setResendAttempt(resendAttempt + 1);
    toast.success("Otp sent");
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleClose} sx={{ p: 0.2 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Container maxWidth="xs">
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom align="center">
              Please enter the OTP to verify your account
            </Typography>
            <Typography
              variant="subtitle2"
              paragraph
              gutterBottom
              align="center"
              sx={{ opacity: 0.8 }}
            >
              A code has been sent to{" "}
              <Typography color="primary" variant="inherit">
                {email}
              </Typography>
            </Typography>
            <form id="myForm" onSubmit={submitHandler}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 2,
                }}
              >
                <TextField
                  inputProps={{ maxLength: 1, sx: { textAlign: "center" } }}
                  sx={{ width: 25, mx: 1 }}
                  variant="standard"
                  autoFocus={true}
                  name="first"
                  id="1"
                  value={otp.first}
                  onChange={handleChange}
                  onKeyUp={handleClick}
                  required
                />
                <TextField
                  inputProps={{ maxLength: 1, sx: { textAlign: "center" } }}
                  sx={{ width: 25, mx: 1 }}
                  variant="standard"
                  name="second"
                  id="2"
                  value={otp.second}
                  onChange={handleChange}
                  onKeyUp={handleClick}
                  required
                />
                <TextField
                  inputProps={{ maxLength: 1, sx: { textAlign: "center" } }}
                  sx={{ width: 25, mx: 1 }}
                  variant="standard"
                  name="third"
                  id="3"
                  value={otp.third}
                  onChange={handleChange}
                  onKeyUp={handleClick}
                  required
                />
                <TextField
                  inputProps={{ maxLength: 1, sx: { textAlign: "center" } }}
                  sx={{ width: 25, mx: 1 }}
                  variant="standard"
                  name="fourth"
                  id="4"
                  value={otp.fourth}
                  onChange={handleChange}
                  onKeyUp={handleClick}
                  required
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
              >
                Confirm
              </Button>
            </form>
          </Box>
          <Typography
            variant="subtitle2"
            paragraph
            align="center"
            sx={{ opacity: 0.8 }}
          >
            Didn't receive the code?
            <Button
              onClick={handleResend}
              disabled={resendAttempt >= 3 ? true : false}
            >
              Resend ({resendAttempt}/3)
            </Button>
          </Typography>
        </Container>
      </Dialog>
    </>
  );
};

export default OtpBox;
