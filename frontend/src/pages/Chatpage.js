import { useEffect } from "react";
import Navbar from "../components/chat/Navbar";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";
import { useSelector, useDispatch } from "react-redux";
import { setSocket } from "../stateFeatures/socketSlice";
import { io } from "socket.io-client";
import Box from "@mui/material/Box";
import bgImg from "../assets/background.jpg";

const ENDPOINT = window.location.origin;

const Chatpage = () => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const colorMode = useSelector((state) => state.colorMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.emit("setup", loggedUser);
    socket.on("connected", () => dispatch(setSocket(socket)));
  }, [loggedUser]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          background:
            colorMode === "light"
              ? `linear-gradient(
                to bottom,
                rgba(176, 227, 216, 0.35),
                rgba(59, 76, 72, 0.35)
              ), url(${bgImg})`
              : `linear-gradient(
                to bottom,
                rgba(0,0,0, 0.7),
                rgba(0,0,0, 0.7)
              ), url(${bgImg})`,
        }}
      >
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: { xs: 1, md: 2.3 },
            gap: 2.3,
            height: "82vh",
          }}
        >
          <MyChats />

          <ChatBox />
        </Box>
      </Box>
    </>
  );
};

export default Chatpage;
