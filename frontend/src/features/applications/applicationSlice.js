import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Apply Job
export const applyJob = createAsyncThunk(
  "applications/applyJob",
  async ({ jobId, file, userId }) => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobId", jobId);
    formData.append("userId", userId);

    const res = await fetch("http://localhost:5000/applications/apply", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return data;
  }
);

// FETCH applications seeker applied to
export const fetchUserApplications = createAsyncThunk(
  "applications/fetchUserApplications",
  async (userId) => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/applications/user/${userId}`);

    return res.json();
  }
);

// FETCH A JOB APPLICATIONS FOR AN EMPLOYER
export const fetchJobApplications = createAsyncThunk(
  "applications/fetchJobApplications",
  async (jobId) => {
    const res = await fetch(`http://localhost:5000/applications/job/${jobId}`);
    const data = await res.json();
    return data;
  }
);

// UPDATE STATUS (ACCEPT / REJECT)
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, status }) => {
    const res = await fetch(`http://localhost:5000/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
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