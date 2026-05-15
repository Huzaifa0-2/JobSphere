import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { useUser } from "@clerk/clerk-react";

// GET jobs of an employer
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (userId) => {
    const res = await fetch(`http://localhost:5000/jobs/employer/${userId}`, {
      headers: {
        userId
      }
    });
    return res.json();
  }
);

// GET single job by id
export const fetchSingleJob = createAsyncThunk(
  "jobs/fetchSingleJob",
  async (id) => {
    const res = await fetch(`http://localhost:5000/jobs/${id}`);
    return await res.json();
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
        "Content-Type": "application/json",
        userId: job.postedBy
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
        "Content-Type": "application/json",
        userId
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
        "Content-Type": "application/json",
        userId
      },
      body: JSON.stringify({
        ...job,
        userId
      })
    });
    return res.json();
  }
);

// SEARCH jobs
export const searchJobs = createAsyncThunk(
  "jobs/searchJobs",
  async (params) => {
    const query = new URLSearchParams(params).toString();

    const res = await fetch(`http://localhost:5000/jobs/search?${query}`);
    return await res.json();
  }
);


const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    searchResults: [],
    selectedJob: null,
    loading: false,
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
      })
      .addCase(fetchSingleJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleJob.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchSingleJob.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch job";
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
}
});

export default jobSlice.reducer;