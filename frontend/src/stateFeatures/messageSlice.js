import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: [],
  reducers: {
    setMessages: (state, payload) => {
      return payload.action;
    },
  },
});

export const { setMessages } = messageSlice.actions;
export default messageSlice.reducer;
