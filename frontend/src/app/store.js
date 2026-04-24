import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "../features/jobs/jobSlice";
import applicationReducer from "../features/applications/applicationSlice";
import profileReducer from "../features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    jobs: jobReducer,
    applications: applicationReducer,
    seekerProfile: profileReducer
  }
});