import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../config";


// Apply Job
export const applyJob = createAsyncThunk(
    "applications/applyJob",
    async ({ userId, jobId, userName, resumeId, resumeUrl }) => {
        const res = await fetch(`${API_URL}/applications/apply`, {
            method: "POST",
            headers: { "Content-Type": "application/json", userId },
            body: JSON.stringify({ userId, jobId, userName, resumeId, resumeUrl })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Application failed");
        }
        return data;  // ← Just return data, don't call setApplied
    }
)

// FETCH applications seeker applied to
export const fetchUserApplications = createAsyncThunk(
  "applications/fetchUserApplications",
  async (userId) => {
    if (!userId) return;

    const res = await fetch(`${API_URL}/applications/user/${userId}`);

    return res.json();
  }
);

// FETCH A JOB APPLICATIONS FOR AN EMPLOYER
export const fetchJobApplications = createAsyncThunk(
  "applications/fetchJobApplications",
  async (jobId) => {
    const res = await fetch(`${API_URL}/applications/job/${jobId}`);
    const data = await res.json();
    return data;
  }
);

// UPDATE STATUS (ACCEPT / REJECT / REVIEWING)
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, jobTitle, status }) => {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, status })
    });

    const data = await res.json();
    return data;
  }
);

// SLICE
const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {

    // APPLY
    builder.addCase(applyJob.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(applyJob.fulfilled, (state, action) => {
      state.loading = false;
      state.applications.push(action.payload);
    });
    builder.addCase(applyJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // FETCH APPLICATIONS USER APPLIED TO
    builder.addCase(fetchUserApplications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserApplications.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    });
    builder.addCase(fetchUserApplications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // FETCH JOB APPLICATIONS FOR EMPLOYER
    builder.addCase(fetchJobApplications.fulfilled, (state, action) => {
      state.applications = action.payload;
    });

    // UPDATE STATUS (ACCEPT / REJECT)
    builder.addCase(updateApplicationStatus.fulfilled, (state, action) => {
      state.applications = state.applications.map(app =>
        app._id === action.payload._id ? action.payload : app
      );
    });
  }
});

export default applicationSlice.reducer;