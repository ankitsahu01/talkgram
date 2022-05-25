import { createSlice } from "@reduxjs/toolkit";

const setColorInStrg = (oppColor) => {
  let color = oppColor === "light" ? "dark" : "light";
  localStorage.setItem("colorMode", color);
};

if (localStorage.getItem("colorMode") === null) {
  setColorInStrg("dark");
}

const colorModeSlice = createSlice({
  name: "colorMode",
  initialState: localStorage.getItem("colorMode") || "light",
  reducers: {
    toggleColorMode: (state) => {
      setColorInStrg(state);
      return state === "light" ? "dark" : "light";
    },
  },
});

export const { toggleColorMode } = colorModeSlice.actions;

export default colorModeSlice.reducer;
