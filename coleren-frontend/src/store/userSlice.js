import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fid: null,
  uid: null,
  name: null,
  email: null,
  authToken: null,
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
        isAuthenticated:
          action.payload.isAuthenticated ?? state.isAuthenticated,
      };
    },

    setFid: (state, action) => {
      state.fid = action.payload;
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

    setAuthToken: (state, action) => {
      state.authToken = action.payload;
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
  setFid,
  setUid,
  setName,
  setEmail,

  setAuthToken,
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
