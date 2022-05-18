import { createSlice } from "@reduxjs/toolkit";

const colorModeSlice = createSlice({
  name: "colorMode",
  initialState: "light",
  reducers: {
    toggleColorMode: (state) => {
      return state === "light" ? "dark" : "light";
    },
  },
});

export const { toggleColorMode } = colorModeSlice.actions;

export default colorModeSlice.reducer;
