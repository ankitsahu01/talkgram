import { useState, useEffect } from "react";
import Navbar from "../components/chat/Navbar";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";
import { useSelector, useDispatch } from "react-redux";
import { setSocket } from "../stateFeatures/socketSlice";
import { io } from "socket.io-client";
import Paper from "@mui/material/Paper";
import bgImg from "../assets/background.jpg";

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://talkgram.herokuapp.com";

const Chatpage = () => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const colorMode = useSelector((state) => state.colorMode);
  const dispatch = useDispatch();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.emit("setup", loggedUser);
    socket.on("connected", () => dispatch(setSocket(socket)));
  }, [loggedUser]);

  return (
    <div className="Chatpage">
      <Paper
        square
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 20,
            gap: 20,
            height: "85vh",
          }}
        >
          <MyChats fetchAgain={fetchAgain} />

          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </Paper>
    </div>
  );
};

export default Chatpage;
