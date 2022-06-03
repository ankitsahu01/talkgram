import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchDrawer from "./SearchDrawer";
import ProfileModal from "../user/ProfileModal";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PasswordIcon from "@mui/icons-material/Password";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { ListItemIcon, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { removeLoggedUser } from "../../stateFeatures/loggedUserSlice";
import { setSelectedChat } from "../../stateFeatures/selectedChatSlice";
import { setNotifications } from "../../stateFeatures/notificationsSlice";
import { setFetchAgain } from "../../stateFeatures/fetchAgainSlice";
import LightModeLogo from "../../assets/logo_lightmode.png";
import DarkModeLogo from "../../assets/logo_darkmode.png";
import ChangePwdModal from "./ChangePwdModal";
import Colormodeswitch from "../miscellaneous/ColorModeSwitch";

const menuUpConeStyle = (rightMes) => ({
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 0.2,
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: rightMes,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
});

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedUser, notifications, colorMode } = useSelector(
    (state) => state
  );
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const isPofileMenuOpen = Boolean(accountAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAccountAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const LogoutUser = () => {
    dispatch(setSelectedChat(null));
    dispatch(removeLoggedUser());
    navigate("/");
  };

  const fetchNotification = async () => {
    const res = await fetch("/api/user/notification", {
      method: "GET",
      headers: {
        authorization: `Bearer ${loggedUser.token}`,
      },
    });
    const data = await res.json();
    dispatch(setNotifications(data));
  };
  useEffect(() => {
    if (!loggedUser) return;
    fetchNotification();
  }, [loggedUser]);

  const openNotifChat = async (notifMsg) => {
    dispatch(setSelectedChat(notifMsg.chat));
    dispatch(
      setNotifications(
        notifications.filter((notif) => notif._id !== notifMsg._id)
      )
    );
    await fetch("/api/user/notification", {
      method: "delete",
      body: JSON.stringify({
        type: "message",
        messageId: notifMsg._id,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${loggedUser.token}`,
      },
    });
    handleNotificationMenuClose();
  };

  const profileMenuId = "profile-menu";
  const renderAccountMenu = (
    <Menu
      anchorEl={accountAnchorEl}
      id={profileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      PaperProps={menuUpConeStyle(40)}
      open={isPofileMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuClose}>
        <ProfileModal user={loggedUser}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </ProfileModal>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>
        <ChangePwdModal>
          <ListItemIcon>
            <PasswordIcon fontSize="small" />
          </ListItemIcon>
          Change <br /> password
        </ChangePwdModal>
      </MenuItem>
      <Divider />
      <MenuItem onClick={LogoutUser}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const notificationMenuId = "notification-menu";
  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      id={notificationMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      PaperProps={menuUpConeStyle(20)}
      open={isNotificationMenuOpen}
      onClose={handleNotificationMenuClose}
    >
      <Box sx={{ maxHeight: "75vh", overflowY: "auto" }}>
        {notifications.length ? (
          notifications.map((notif) => (
            <MenuItem key={notif._id} onClick={() => openNotifChat(notif)}>
              New message
              {notif.chat.isGroupChat
                ? " in " + notif.chat.chatName
                : " from " + notif.sender.fullname}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No message</MenuItem>
        )}
      </Box>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ bgcolor: "background.paper", color: "primary.main" }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link
              to="/"
              onClick={() => {
                dispatch(setSelectedChat(null));
                dispatch(setFetchAgain());
              }}
            >
              <img
                src={colorMode === "light" ? LightModeLogo : DarkModeLogo}
                alt="Logo"
                style={{ maxWidth: 130 }}
              />
            </Link>
          </Box>
          <Box sx={{ display: "flex", gap: { xs: 0, md: 2 } }}>
            <Colormodeswitch />
            <SearchDrawer />
            <Tooltip title="New messages">
              <IconButton
                size="large"
                aria-label="show new messages"
                aria-controls={notificationMenuId}
                onClick={handleNotificationMenuOpen}
                color="inherit"
              >
                <Badge badgeContent={notifications.length} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={profileMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Badge
                color="success"
                variant="dot"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar
                  sx={{
                    width: 26,
                    height: 26,
                    bgcolor: "primary.main",
                    border: 1,
                  }}
                  src={loggedUser.pic}
                  alt={loggedUser.fullname}
                />
              </Badge>
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderAccountMenu}
      {renderNotificationMenu}
    </Box>
  );
}
