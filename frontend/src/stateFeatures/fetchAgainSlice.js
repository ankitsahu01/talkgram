import { createSlice } from "@reduxjs/toolkit";

const fetchAgainSlice = createSlice({
  name: "fetchAgain",
  initialState: false,
  reducers: {
    setFetchAgain: (state) => {
      return !state;
    },
  },
});

export const { setFetchAgain } = fetchAgainSlice.actions;
export default fetchAgainSlice.reducer;
