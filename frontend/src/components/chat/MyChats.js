import { useState, useEffect } from "react";
import { getSender } from "../../config/ChatLogics";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, Grid, Avatar } from "@mui/material";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CreateGroupModal from "./CreateGroupModal";
import GroupsIcon from "@mui/icons-material/Groups";
import DotIndicator from "../animations/DotIndicator";
import UserSearchSkeleton from "../user/UserSearchSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "../../stateFeatures/chatsSlice";
import { setSelectedChat } from "../../stateFeatures/selectedChatSlice";
import { setNotifications } from "../../stateFeatures/notificationsSlice";

const MyChats = ({ fetchAgain }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { loggedUser, chats, notifications, selectedChat } = useSelector(
    (state) => state
  );

  const fetchChats = async () => {
    try {
      if (!chats.length) setLoading(true);
      const res = await fetch("/api/chat", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
      const data = await res.json();
      dispatch(setChats(data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const handleSelectChat = async (chat) => {
    dispatch(setSelectedChat(chat));
    const isNotif = notifications.find((notif) => notif.chat._id === chat._id);
    if (isNotif) {
      dispatch(
        setNotifications(
          notifications.filter((notif) => notif.chat._id !== chat._id)
        )
      );
      await fetch("/api/user/notification", {
        method: "delete",
        body: JSON.stringify({
          type: "message",
          messageId: isNotif._id,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedUser.token}`,
        },
      });
    }
  };

  return (
    <>
      <Paper
        sx={{
          display: { md: "flex", xs: selectedChat ? "none" : "flex" },
          flexDirection: "column",
          alignItems: "center",
          width: { md: "50%", xs: "100%" },
          backdropFilter: "blur(10px)",
          outline: "5px solid lightgrey",
          borderRadius: 1.5,
          height: "inherit",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            py: 1.5,
            px: 3,
            mb: 1,
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            bgcolor: "inherit",
            zIndex: 1,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h4">
            My Chats
          </Typography>

          <CreateGroupModal>
            <Button variant="outlined" startIcon={<AddIcon />}>
              Group Chat
            </Button>
          </CreateGroupModal>
        </Box>
        <Stack spacing={1} sx={{ width: "100%", p: 1.5 }}>
          {chats &&
            chats.map((chat) => (
              <Card
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                sx={{ borderRadius: 2 }}
              >
                <CardActionArea>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 0.3,
                      px: 1,
                      color: "black",
                      bgcolor:
                        selectedChat?._id === chat._id
                          ? "lightblue"
                          : "lightgrey",
                      "&:hover": {
                        bgcolor: "lightblue",
                      },
                    }}
                  >
                    <Grid container columnSpacing={1}>
                      <Grid item sx={{ alignSelf: "center" }}>
                        {chat.isGroupChat ? (
                          <Avatar>
                            <GroupsIcon />
                          </Avatar>
                        ) : (
                          <Avatar
                            alt={getSender(loggedUser, chat.users).fullname}
                            src={getSender(loggedUser, chat.users).pic}
                          />
                        )}
                      </Grid>
                      <Grid item sx={{ width: "75%" }}>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {chat.isGroupChat
                            ? chat.chatName
                            : getSender(loggedUser, chat.users).fullname}
                        </Typography>
                        {chat.latestMessage && (
                          <Typography
                            variant="body1"
                            component="h2"
                            sx={{
                              fontSize: 10,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <strong>
                              {chat.latestMessage.sender._id === loggedUser._id
                                ? "You"
                                : chat.latestMessage.sender.username}
                              {" : "}
                            </strong>
                            {chat.latestMessage.content}
                          </Typography>
                        )}
                      </Grid>
                      {notifications
                        .map((notif) => notif.chat._id)
                        .includes(chat._id) && (
                        <Grid
                          item
                          sx={{
                            alignSelf: "center",
                            ml: "auto",
                            // pr: 1,
                          }}
                        >
                          <DotIndicator />
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          {loading && <UserSearchSkeleton />}
        </Stack>
      </Paper>
    </>
  );
};

export default MyChats;
