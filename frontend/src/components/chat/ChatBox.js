import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../stateFeatures/selectedChatSlice";
import { setNotifications } from "../../stateFeatures/notificationsSlice";
import { setFetchAgain } from "../../stateFeatures/fetchAgainSlice";
import { setMessages } from "../../stateFeatures/messageSlice";
import { getSender } from "../../config/ChatLogics";
import UpdateGroupModal from "./UpdateGroupModal";
import SingleChat from "./SingleChat";
import ProfileModal from "../user/ProfileModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

const ChatBox = () => {
  const dispatch = useDispatch();
  const { loggedUser, notifications, selectedChat, socket, messages } =
    useSelector((state) => state);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    if (!selectedChat) return;
    try {
      const res = await fetch(`/api/message/${selectedChat._id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      const data = await res.json();
      dispatch(setMessages(data));
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (!Boolean(socket.value)) return;
    socket.value.off("message received");
    return socket.value.on("message received", async (newMsgReceived) => {
      if (!selectedChat || selectedChat._id !== newMsgReceived.chat._id) {
        if (
          !notifications
            .map((notif) => notif.chat._id)
            .find((chatId) => chatId === newMsgReceived.chat._id)
        ) {
          await fetch("/api/user/notification", {
            method: "POST",
            body: JSON.stringify({
              type: "message",
              messageId: newMsgReceived._id,
            }),
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${loggedUser.token}`,
            },
          });
        }
        const filterNotifs = notifications.filter(
          (notif) => notif.chat._id !== newMsgReceived.chat._id
        );
        dispatch(setNotifications([newMsgReceived, ...filterNotifs]));
      } else {
        dispatch(setMessages([...messages, newMsgReceived]));
      }
      dispatch(setFetchAgain());
    });
  });

  return (
    <Box
      sx={{
        display: {
          md: "flex",
          xs: selectedChat ? "flex" : "none",
          backdropFilter: "blur(10px)",
          outline: "5px solid lightgrey",
        },
        p: 2,
        pt: 0.5,
        flexDirection: "column",
        width: "100%",
        height: "inherit",
        borderRadius: 1.5,
      }}
    >
      {selectedChat && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            height: 45,
            borderBottomColor: "rgba(0,0,0,0.3)",
          }}
        >
          <IconButton
            sx={{ display: { md: "none", xs: "flex" } }}
            onClick={() => {
              dispatch(setSelectedChat(null));
              dispatch(setFetchAgain());
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h4" component="h2">
            {selectedChat?.isGroupChat
              ? selectedChat.chatName
              : getSender(loggedUser, selectedChat.users).fullname}
          </Typography>
          {selectedChat?.isGroupChat ? (
            <UpdateGroupModal>
              <IconButton>
                <EditIcon />
              </IconButton>
            </UpdateGroupModal>
          ) : (
            <ProfileModal user={getSender(loggedUser, selectedChat.users)}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </ProfileModal>
          )}
        </Box>
      )}

      {!selectedChat && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="p">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}

      {loading && selectedChat && (
        <CircularProgress
          sx={{ alignSelf: "center", m: "auto" }}
          color="inherit"
        />
      )}

      {!loading && selectedChat && messages && <SingleChat />}
    </Box>
  );
};

export default ChatBox;
