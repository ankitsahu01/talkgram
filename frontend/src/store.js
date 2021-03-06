import { configureStore } from "@reduxjs/toolkit";
import loggedUserReducer from "./stateFeatures/loggedUserSlice";
import socketReducer from "./stateFeatures/socketSlice";
import chatsReducer from "./stateFeatures/chatsSlice";
import fetchAgainReducer from "./stateFeatures/fetchAgainSlice";
import notificationsReducer from "./stateFeatures/notificationsSlice";
import selectedChatReducer from "./stateFeatures/selectedChatSlice";
import colorModeReducer from "./stateFeatures/colorModeSlice";
import messageReducer from "./stateFeatures/messageSlice";

export const store = configureStore({
  reducer: {
    loggedUser: loggedUserReducer,
    socket: socketReducer,
    chats: chatsReducer,
    notifications: notificationsReducer,
    selectedChat: selectedChatReducer,
    colorMode: colorModeReducer,
    fetchAgain: fetchAgainReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // To solve the error of "A non-serializable value was detected in the state".
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
