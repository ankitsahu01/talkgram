import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Chip,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import UserSearchItem from "../user/UserSearchItem";
import { toast } from "react-toastify";
import UserSearchSkeleton from "../user/UserSearchSkeleton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ProfileModal from "../user/ProfileModal";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../stateFeatures/selectedChatSlice";

const UpdateGroupModal = ({ children, fetchAgain, setFetchAgain }) => {
  const dispatch = useDispatch();
  const { loggedUser, selectedChat } = useSelector((state) => state);
  const [loading, setLoading] = useState({
    isSearching: false,
    isUpdating: false,
  });
  const [open, setOpen] = useState(false);
  const [modalUser, setModalUser] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [input, setInput] = useState({ groupName: "", searchInp: "" });
  const [selectedMembers, setSelectedMembers] = useState([]);

  const loadData = () => {
    setSelectedMembers(
      selectedChat.users.filter(({ _id }) => _id !== loggedUser._id)
    );
    setInput({ ...input, groupName: selectedChat.chatName });
  };

  useEffect(() => {
    loadData();
  }, [selectedChat]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSearchResult([]);
    setLoading({
      isSearching: false,
      isUpdating: false,
    });
    setOpen(false);
    loadData();
    setInput({ ...input, searchInp: "" });
  };

  const handleSearch = async (search, members) => {
    try {
      setLoading({ ...loading, isSearching: true });
      if (search === "") return setSearchResult([]);
      const res = await fetch(`/api/user?search=${search}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      let data = await res.json();
      if (members.length > 0) {
        data = data.filter(({ _id }) => !members.find((u) => u._id === _id));
      }
      setSearchResult(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading({ ...loading, isSearching: false });
    }
  };

  const handleInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    setInput({ ...input, [name]: value });
    if (name === "searchInp") handleSearch(value, selectedMembers);
  };

  const reqToBackend = async (url, method, bodyData, successMsg) => {
    try {
      setLoading({ ...loading, isUpdating: true });
      const res = await fetch(url, {
        method,
        body: JSON.stringify(bodyData),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      const data = await res.json();
      if (res.status !== 200) {
        toast.error(data.message);
        return false;
      }
      toast.success(successMsg);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading({ ...loading, isUpdating: false });
    }
  };

  const addUser = async (userId) => {
    const url = "/api/chat/group/addUser";
    const bodyData = {
      groupChatId: selectedChat._id,
      userId,
    };
    const added = await reqToBackend(url, "PUT", bodyData, "User added");
    if (added) {
      dispatch(setSelectedChat(added));
      setSearchResult(searchResult.filter(({ _id }) => _id !== userId));
    }
  };

  const removeUser = async (userId) => {
    const url = "/api/chat/group/removeUser";
    const bodyData = {
      groupChatId: selectedChat._id,
      userId,
    };
    const removed = await reqToBackend(url, "PUT", bodyData, "User removed");
    if (removed) {
      const restMembers = selectedMembers.filter(({ _id }) => _id !== userId);
      handleSearch(input.searchInp, restMembers);
      dispatch(setSelectedChat(removed));
    }
  };

  const renameGroup = async () => {
    if (!input.groupName) return toast.warning("Enter group name!");
    const url = "/api/chat/group/rename";
    const bodyData = {
      groupNewName: input.groupName,
      groupChatId: selectedChat._id,
    };
    const renamed = await reqToBackend(
      url,
      "PUT",
      bodyData,
      "Group name updated"
    );
    if (renamed) {
      setFetchAgain(!fetchAgain);
      dispatch(setSelectedChat(renamed));
      handleClose();
    }
  };

  const leaveGroup = async () => {
    const url = "/api/chat/group/removeUser";
    const bodyData = {
      groupChatId: selectedChat._id,
      userId: loggedUser._id,
    };
    const isLeft = await reqToBackend(
      url,
      "PUT",
      bodyData,
      "You left the group"
    );
    if (isLeft) {
      setFetchAgain(!fetchAgain);
      dispatch(setSelectedChat(null));
      handleClose();
    }
  };

  const deleteGroup = async () => {
    const url = "/api/chat/group/delete";
    const bodyData = {
      groupChatId: selectedChat._id,
    };
    const isDeleted = await reqToBackend(
      url,
      "DELETE",
      bodyData,
      "Group deleted"
    );
    if (isDeleted) {
      setFetchAgain(!fetchAgain);
      dispatch(setSelectedChat(null));
      handleClose();
    }
  };

  const openProfileModal = (u) => {
    setModalUser(u);
    document.getElementById("open_modal").click();
  };

  return (
    <>
      <Box onClick={handleOpen}>{children}</Box>
      <Dialog
        open={open}
        onClose={handleClose}
        // sx={{ backdropFilter: "blur(1px)" }}
      >
        <Box sx={{ height: 500 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              px: 3,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
            component="form"
          >
            <Typography variant="h5" component="h1" align="center" gutterBottom>
              Group admin:{" "}
              <span style={{ opacity: 0.8 }}>
                {selectedChat.groupAdmin.username}
              </span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Group Name"
              placeholder="Enter Group Name"
              name="groupName"
              value={input.groupName}
              onChange={handleInput}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={renameGroup}>Rename</Button>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              size="small"
              label={
                loggedUser._id === selectedChat.groupAdmin._id
                  ? "Add user"
                  : "Only admin can add/remove users"
              }
              placeholder="Type Name or Username"
              name="searchInp"
              value={input.searchInp}
              disabled={loggedUser._id !== selectedChat.groupAdmin._id}
              onChange={handleInput}
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                p: 0.5,
                maxWidth: 300,
                justifyContent: "center",
              }}
            >
              <Chip
                avatar={
                  <Avatar alt={loggedUser.username} src={loggedUser.pic} />
                }
                label={"You: " + loggedUser.username}
                size="small"
                sx={{ m: 0.5 }}
              />
              {selectedMembers?.map((u) => (
                <Chip
                  key={u._id}
                  avatar={<Avatar alt={u.username} src={u.pic} />}
                  label={u.username}
                  size="small"
                  sx={{ m: 0.5 }}
                  onClick={() => openProfileModal(u)}
                  onDelete={
                    loggedUser._id === selectedChat.groupAdmin._id
                      ? () => removeUser(u._id)
                      : () =>
                          toast.error(
                            "You'r not permitted to remove/add users!"
                          )
                  }
                />
              ))}
            </Box>
            <Box
              sx={{
                height: 220,
                overflowY: "auto",
              }}
            >
              {searchResult?.slice(0, 4).map((u) => (
                <UserSearchItem
                  key={u._id}
                  user={u}
                  handleFunc={() => addUser(u._id)}
                />
              ))}

              {loading.isSearching && <UserSearchSkeleton />}

              {!loading.isSearching &&
                input.searchInp !== "" &&
                searchResult.length <= 0 && (
                  <Typography
                    variant="body1"
                    sx={{ pt: 2 }}
                    align="center"
                    color="error"
                  >
                    User not found!
                  </Typography>
                )}
            </Box>
          </Box>
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              p: 2,
            }}
          >
            <LinearProgress
              sx={{
                mb: 1,
                borderRadius: 5,
                visibility: loading.isUpdating ? "visible" : "hidden",
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                color="warning"
                variant="contained"
                onClick={leaveGroup}
                startIcon={<ExitToAppIcon />}
                fullWidth={loggedUser._id !== selectedChat.groupAdmin._id}
              >
                Leave
              </Button>
              {loggedUser._id === selectedChat.groupAdmin._id && (
                <Button
                  color="error"
                  variant="contained"
                  onClick={deleteGroup}
                  startIcon={<DeleteOutlineIcon />}
                >
                  Delete
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "none" }}>
          <ProfileModal user={modalUser}>
            <span id="open_modal" />
          </ProfileModal>
        </Box>
      </Dialog>
    </>
  );
};

export default UpdateGroupModal;
