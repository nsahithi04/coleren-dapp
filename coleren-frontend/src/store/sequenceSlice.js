import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeType: "callSummary",
};

const sequenceSlice = createSlice({
  name: "sequence",
  initialState,
  reducers: {
    setActiveType: (state, action) => {
      state.activeType = action.payload;
    },
  },
});

export const { setActiveType } = sequenceSlice.actions;
export default sequenceSlice.reducer;
