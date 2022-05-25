import { useState } from "react";
import UserSearchSkeleton from "../user/UserSearchSkeleton";
import UserSearchItem from "../user/UserSearchItem";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../stateFeatures/selectedChatSlice";
import { setChats } from "../../stateFeatures/chatsSlice";
import { Paper } from "@mui/material";

const SearchDrawer = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [loadingChat, setLoadingChat] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const dispatch = useDispatch();
  const { loggedUser, chats } = useSelector((state) => state);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (open === false) setSearchResult(null);
    setOpen(open);
  };

  const handleSearch = async (e) => {
    try {
      setLoading(true);
      setSearchResult(null);
      const username = e.target.value;
      if (!username) return;
      const res = await fetch(`/api/user?search=${username}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const accessOrCreateChat = async (userId) => {
    try {
      // setLoadingChat(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      const data = await res.json();
      if (!chats.find((c) => c._id === data._id))
        dispatch(setChats([data, ...chats]));
      dispatch(setSelectedChat(data));
      setSearchResult(null);
      setOpen(false);
    } catch (err) {
      console.log(err.message);
    } finally {
      // setLoadingChat(false);
    }
  };

  return (
    <Box>
      <Tooltip title="Search user">
        <IconButton
          size="large"
          aria-label="search users"
          color="inherit"
          onClick={toggleDrawer(true)}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Paper
          square
          sx={{
            p: 2,
            pl: 0,
            position: "sticky",
            top: 0,
            zIndex: 1,
            display: "flex",
          }}
        >
          <Tooltip title="Go back">
            <IconButton
              size="large"
              aria-label="back button"
              color="primary"
              onClick={toggleDrawer(false)}
              sx={{ mt: "3px" }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Tooltip>
          <TextField
            autoFocus
            label="Search User"
            placeholder="Type Name/Username"
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>
        <div style={{ padding: 16, paddingTop: 10 }}>
          {searchResult && searchResult.length > 0 ? (
            searchResult.map((user) => (
              <UserSearchItem
                key={user._id}
                user={user}
                handleFunc={() => accessOrCreateChat(user._id)}
              />
            ))
          ) : searchResult && searchResult.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ pt: 2 }}
              align="center"
              color="error"
            >
              No user found!
            </Typography>
          ) : (
            ""
          )}
          {loading && <UserSearchSkeleton />}
        </div>
      </Drawer>
    </Box>
  );
};

export default SearchDrawer;
