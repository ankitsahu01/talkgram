import { useState, useEffect } from "react";
import { Typography, Box, Avatar } from "@mui/material";
import ProfileModal from "../user/ProfileModal";
import { getDate, getTime } from "../../config/ChatLogics";
import LoadingAnimation from "../animations/LoadingAnimation";
import SendMsgForm from "./SendMsgForm";
import { useSelector } from "react-redux";

const SingleChat = ({ messages, setMessages, fetchAgain, setFetchAgain }) => {
  const { loggedUser, selectedChat, socket } = useSelector((state) => state);
  const [modalUser, setModalUser] = useState({});
  const [isOthersTyping, setIsOthersTyping] = useState(false);
  const [whoIsTyping, setWhoIsTyping] = useState("");

  useEffect(() => {
    if (!Boolean(socket.value)) return;
    socket.value.emit("join chat", selectedChat._id);
    socket.value.on("typing", (username, chatRoomId) => {
      if (selectedChat._id === chatRoomId) {
        setIsOthersTyping(true);
        setWhoIsTyping(username);
      }
    });
    socket.value.on("stop typing", (chatRoomId) => {
      if (selectedChat._id === chatRoomId) {
        setIsOthersTyping(false);
      }
    });
  }, [Boolean(socket.value)]);

  const scrollToLastMsg = () => {
    document.getElementById("endScroll").scrollIntoView({ block: "nearest" });
  };

  useEffect(() => {
    scrollToLastMsg();
  }, [messages]);

  const openProfileModal = (u) => {
    setModalUser(u);
    document.getElementById("modal").click();
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflowY: "auto",
          bgcolor: "rgba(102,102,102,0.3)",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflowY: "inherit",
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg._id}
              sx={{
                my: 0.8,
                mx: { xs: 1, md: 1.5 },
                alignSelf:
                  msg.sender._id === loggedUser._id ? "flex-end" : "flex-start",
                display: "flex",
                gap: 0.5,
              }}
            >
              {selectedChat.isGroupChat &&
                msg.sender._id !== loggedUser._id && (
                  <Avatar
                    sx={{ alignSelf: "flex-end", cursor: "pointer" }}
                    alt={msg.sender.username}
                    src={msg.sender.pic}
                    onClick={() => openProfileModal(msg.sender)}
                  />
                )}
              <Box
                sx={{
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  px: 1.5,
                  py: 0.5,
                  backgroundColor:
                    msg.sender._id === loggedUser._id
                      ? "lightblue"
                      : "lightgreen",
                  color: "black",
                  borderRadius: 1,
                  maxWidth: { xs: 150, md: 400 },
                  position: "relative",
                  borderColor:
                    msg.sender._id === loggedUser._id
                      ? "lightblue"
                      : "lightgreen",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: msg.sender._id === loggedUser._id ? "-5px" : "50%",
                    left: msg.sender._id !== loggedUser._id ? "-5px" : "50%",
                    borderWidth: 10,
                    borderStyle: "solid",
                    borderColor: "inherit",
                    borderTopColor: "transparent",
                    borderRightColor:
                      msg.sender._id === loggedUser._id
                        ? "transparent"
                        : "inherit",
                    borderLeftColor:
                      msg.sender._id === loggedUser._id
                        ? "inherit"
                        : "transparent",
                  }}
                ></span>

                <Typography
                  variant="subtitle2"
                  sx={{ textDecoration: "underline", opacity: 0.5 }}
                >
                  {selectedChat.isGroupChat
                    ? msg.sender._id !== loggedUser._id
                      ? msg.sender.username
                      : "You"
                    : ""}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ my: 1.5, wordWrap: "break-word" }}
                >
                  {msg.content}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "end",
                    opacity: 0.5,
                  }}
                >
                  <Typography variant="caption">
                    {getDate(msg.createdAt)}
                  </Typography>
                  <Typography variant="caption">
                    {getTime(msg.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          <div id="endScroll"></div>
        </Box>

        <div
          style={{
            display: "flex",
            height: 60,
            paddingLeft: 5,
            opacity: 0.9,
            alignItems: "center",
          }}
        >
          {isOthersTyping ? (
            <>
              {whoIsTyping} typing <LoadingAnimation />
            </>
          ) : (
            <></>
          )}
        </div>

        <Box sx={{ p: 0.7, pt: 0 }}>
          <SendMsgForm
            messages={messages}
            setMessages={setMessages}
            scrollToLastMsg={scrollToLastMsg}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        </Box>

        <Box sx={{ display: "none" }}>
          <ProfileModal user={modalUser}>
            <span id="modal" />
          </ProfileModal>
        </Box>
      </Box>
    </>
  );
};

export default SingleChat;
