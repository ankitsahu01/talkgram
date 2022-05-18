import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ChangePwdModal = ({ children }) => {
  const { loggedUser } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showOPwd, setShowOPwd] = useState(false);
  const [showNPwd, setShowNPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const reset = () => {
    setData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = data;
    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.warning("Please fill all the fields!");

    if (newPassword !== confirmPassword)
      return toast.warning("Password not matching!");

    if (newPassword.length <= 5)
      return toast.error("Password should more than 5 characters");

    try {
      setLoading(true);
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      const resData = await res.json();
      console.log(resData);
      if (resData.success) {
        toast.success("You have successfully changed your password.");
        handleClose();
      } else toast.error(resData.message);
    } catch (err) {
      console.log(err);
      toast.error("Unable to change password, Try later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {children ? children : "Change password"}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        // sx={{ backdropFilter: "blur(3px)" }}
      >
        <LinearProgress
          sx={{
            visibility: loading ? "visible" : "hidden",
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pb: 1.5 }}>
          <Typography
            id="modal-profile-title"
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
          >
            Change Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ pt: 1 }}
          >
            <TextField
              label="Old password"
              size="small"
              autoFocus
              type={showOPwd ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => setShowOPwd(!showOPwd)}
                  >
                    <IconButton>
                      {showOPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="oldPassword"
              value={data.oldPassword}
              onChange={handleInput}
              required
            />
            <TextField
              label="New password"
              size="small"
              type={showNPwd ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => setShowNPwd(!showNPwd)}
                  >
                    <IconButton>
                      {showNPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="newPassword"
              value={data.newPassword}
              onChange={handleInput}
              required
            />
            <TextField
              label="Confirm password"
              size="small"
              type={showCPwd ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => setShowCPwd(!showCPwd)}
                  >
                    <IconButton>
                      {showCPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleInput}
              required
            />
            <Button
              variant="contained"
              color="success"
              type="submit"
              disabled={loading}
            >
              Change
            </Button>
            <Divider sx={{ my: 1 }} />
            <Button variant="outlined" color="error" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ChangePwdModal;
