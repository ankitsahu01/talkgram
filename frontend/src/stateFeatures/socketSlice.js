import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: { value: null },
  reducers: {
    setSocket: (state, action) => {
      return { value: action.payload };
    },
    removeSocket: (state) => {
      return { value: null };
    },
  },
});

export const { setSocket, removeSocket } = socketSlice.actions;

export default socketSlice.reducer;
