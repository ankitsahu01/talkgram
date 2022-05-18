import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
  name: "chat",
  initialState: [],
  reducers: {
    setChats: (state, action) => {
      return action.payload;
    },
  },
});

export const { setChats } = chatsSlice.actions;
export default chatsSlice.reducer;
