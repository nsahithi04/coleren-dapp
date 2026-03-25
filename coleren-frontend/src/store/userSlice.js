import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: null,
  name: null,
  email: null,
  role: null,
  teamSize: null,
  workType: null,
  subscribed: false,
  fromGoogle: false,
  isAuthenticated: false,
  isPendingOnboarding: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    },

    setUid: (state, action) => {
      state.uid = action.payload;
    },

    setName: (state, action) => {
      state.name = action.payload;
    },

    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setRole: (state, action) => {
      state.role = action.payload;
    },

    setTeamSize: (state, action) => {
      state.teamSize = action.payload;
    },

    setWorkType: (state, action) => {
      state.workType = action.payload;
    },

    setSubscribed: (state, action) => {
      state.subscribed = action.payload;
    },

    setfromGoogle: (state, action) => {
      state.fromGoogle = action.payload;
    },

    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setPendingOnboarding: (state, action) => {
      state.isPendingOnboarding = action.payload;
    },

    logoutUser: () => initialState,
  },
});

export const {
  setUser,
  setUid,
  setName,
  setEmail,
  setRole,
  setTeamSize,
  setWorkType,
  setSubscribed,
  setfromGoogle,
  setAuthenticated,
  logoutUser,
  setPendingOnboarding,
} = userSlice.actions;

export default userSlice.reducer;
