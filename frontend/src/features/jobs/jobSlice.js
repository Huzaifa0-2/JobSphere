import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { useUser } from "@clerk/clerk-react";

// GET jobs of an employer
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (userId) => {
    const res = await fetch(`http://localhost:5000/jobs/employer/${userId}`);
    return res.json();
  }
);

// GET all jobs (for seeker dashboard)
export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAllJobs",
  async () => {
    const res = await fetch("http://localhost:5000/jobs");
    return res.json();
  }
);

// ADD job
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (job) => {
    const res = await fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(job)
    });
    return res.json();
  }
);

// DELETE job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async ({ id, userId }) => {
    await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId
      })
    });
    return id;
  }
);

// UPDATE job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, job, userId }) => {
    
    // const user = useUser();
    // const userId = user.id;

    const res = await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...job,
        userId
      })
    });
    return res.json();
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    status: "idle"
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.map(job =>
          job._id === action.payload._id ? action.payload : job
        );
      });
  }
});

export default jobSlice.reducer;