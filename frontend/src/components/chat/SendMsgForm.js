import { useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setFetchAgain } from "../../stateFeatures/fetchAgainSlice";
import { setMessages } from "../../stateFeatures/messageSlice";

const SendMsgForm = ({ scrollToLastMsg }) => {
  const dispatch = useDispatch();
  const { loggedUser, selectedChat, socket, messages } = useSelector(
    (state) => state
  );
  const [inpMsg, setInpMsg] = useState("");
  const [selfTyping, setSelfTyping] = useState(false);

  const sendMessage = async () => {
    try {
      socket.value.emit("stop typing", selectedChat._id);
      setSelfTyping(false);
      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ content: inpMsg, chatId: selectedChat._id }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      const data = await res.json();
      socket.value.emit("new message", data);
      dispatch(setMessages([...messages, data]));
      setInpMsg("");
      scrollToLastMsg();
      dispatch(setFetchAgain());
    } catch (err) {
      toast.error(err.message);
      console.log(err.message);
    }
  };

  const typingHandler = (e) => {
    setInpMsg(e.target.value);
    if (!Boolean(socket.value)) return;
    var typingStatus = selfTyping;
    if (!selfTyping) {
      setSelfTyping(true);
      typingStatus = true;
      socket.value.emit("typing", selectedChat._id, loggedUser.username);
    }
    let startTypingTime = new Date().getTime();
    var timerLen = 3000;
    setTimeout(() => {
      var endTypingTime = new Date().getTime();
      var timeDiff = endTypingTime - startTypingTime;
      if (timeDiff >= timerLen && typingStatus) {
        socket.value.emit("stop typing", selectedChat._id);
        setSelfTyping(false);
      }
    }, timerLen);
  };

  const handleMessage = (e) => {
    if (e.key.toLowerCase() === "enter" && inpMsg) {
      sendMessage();
    }
  };
  return (
    <FormControl fullWidth onKeyDown={handleMessage}>
      <OutlinedInput
        size="small"
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
        value={inpMsg}
        onChange={typingHandler}
      />
    </FormControl>
  );
};

export default SendMsgForm;
