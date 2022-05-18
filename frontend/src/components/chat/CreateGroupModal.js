import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Chip, LinearProgress, TextField } from "@mui/material";
import UserSearchItem from "../user/UserSearchItem";
import { toast } from "react-toastify";
import UserSearchSkeleton from "../user/UserSearchSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "../../stateFeatures/chatsSlice";
import { setSelectedChat } from "../../stateFeatures/selectedChatSlice";

const CreateGroupModal = ({ children }) => {
  const dispatch = useDispatch();
  const { loggedUser, chats } = useSelector((state) => state);
  const [loading, setLoading] = useState({
    isSearching: false,
    isSubmitting: false,
  });
  const [open, setOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [input, setInput] = useState({ groupName: "", searchInp: "" });
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSearchResult([]);
    setSelectedMembers([]);
    setLoading({ isSearching: false, isSubmitting: false });
    setInput({ groupName: "", searchInp: "" });
    setOpen(false);
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

  const appendUser = (u) => {
    setSearchResult(searchResult.filter(({ _id }) => _id !== u._id));
    setSelectedMembers([...selectedMembers, u]);
  };

  const popUser = (u) => {
    const restMembers = selectedMembers.filter(({ _id }) => _id !== u._id);
    setSelectedMembers(restMembers);
    handleSearch(input.searchInp, restMembers);
  };

  const createGroup = async () => {
    if (!input.groupName) {
      return toast.warning("Group name is required!");
    } else if (selectedMembers.length < 2) {
      return toast.warning("Atleast 2 members required to create a group.");
    }
    try {
      setLoading({ ...loading, isSubmitting: true });
      const url = "/api/chat/group/create";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          groupName: input.groupName,
          users: selectedMembers,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      const data = await res.json();
      if (res.status === 201) {
        toast.success("Group created.");
        dispatch(setChats([data, ...chats]));
        dispatch(setSelectedChat(data));
        handleClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading({ ...loading, isSubmitting: false });
    }
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
            <Typography variant="h4" component="h1" align="center">
              Create Group Chat
            </Typography>
            <TextField
              fullWidth
              required
              size="small"
              label="Group Name"
              placeholder="Enter Group Name"
              name="groupName"
              value={input.groupName}
              onChange={handleInput}
            />
            <TextField
              fullWidth
              size="small"
              label="Search Users"
              placeholder="Type Name or Username"
              name="searchInp"
              value={input.searchInp}
              onChange={handleInput}
            />
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
              {selectedMembers?.map((u) => (
                <Chip
                  key={u._id}
                  avatar={<Avatar alt={u.username} src={u.pic} />}
                  label={u.username}
                  size="small"
                  onDelete={() => popUser(u)}
                />
              ))}
            </Box>
            <Box
              sx={{
                // width: 300,
                height: 220,
                overflowY: "auto",
              }}
            >
              {searchResult?.slice(0, 4).map((u) => (
                <UserSearchItem
                  key={u._id}
                  user={u}
                  handleFunc={() => appendUser(u)}
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
              p: 1,
              px: 2.5,
            }}
          >
            <LinearProgress
              sx={{
                mb: 1,
                borderRadius: 5,
                visibility: loading.isSubmitting ? "visible" : "hidden",
              }}
            />
            <Button
              variant="contained"
              disabled={loading.isSubmitting}
              fullWidth
              onClick={createGroup}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default CreateGroupModal;
