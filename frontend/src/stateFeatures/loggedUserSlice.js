import { createSlice } from "@reduxjs/toolkit";
const initialStateVal = JSON.parse(localStorage.getItem("userInfo"));

const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState: initialStateVal,
  reducers: {
    setLoggedUser: (state, action) => {
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return action.payload;
    },
    removeLoggedUser: (state) => {
      localStorage.removeItem("userInfo");
      return null;
    },
  },
});

export const { setLoggedUser, removeLoggedUser } = loggedUserSlice.actions;

export default loggedUserSlice.reducer;
