import { createSlice } from "@reduxjs/toolkit";

const selectedChatSlice = createSlice({
  name: "selectedChat",
  initialState: null,
  reducers: {
    setSelectedChat: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSelectedChat } = selectedChatSlice.actions;
export default selectedChatSlice.reducer;
