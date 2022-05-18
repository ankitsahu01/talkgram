import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        {children ? children : "show"}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        // sx={{ backdropFilter: "blur(3px)" }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ py: 2, px: 4 }}>
          <Typography
            id="modal-profile-title"
            variant="h4"
            component="h1"
            align="center"
          >
            {user.fullname || ""}
          </Typography>
          <Typography
            id="modal-username"
            variant="caption"
            component="h2"
            align="center"
            sx={{ textDecoration: "underline" }}
            gutterBottom
          >
            {user.username || ""}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
            <img
              style={{ width: 180, height: 180, borderRadius: "50%" }}
              src={
                user.pic
                  ? user.pic !== ""
                    ? user.pic !== "undefined"
                      ? user.pic
                      : "https://img.icons8.com/material/144/000000/user-male-circle--v1.png"
                    : "https://img.icons8.com/material/144/000000/user-male-circle--v1.png"
                  : "https://img.icons8.com/material/144/000000/user-male-circle--v1.png"
              }
              alt={user.fullname || ""}
            />
          </Box>
          <Typography
            id="modal-email"
            variant="h5"
            align="center"
            sx={{ my: 2, opacity: 0.7 }}
          >
            Email: {user.email || ""}
          </Typography>
        </Box>
      </Dialog>
    </>
  );
};

export default ProfileModal;
