import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// FETCH SEEKER PROFILE
export const fetchSeekerProfile = createAsyncThunk(
    "profile/fetchSeekerProfile",
    async (userId) => {
        const res = await fetch(`http://localhost:5000/profile/${userId}`);
        return res.json();
    }
);

// CREATE UPDATE SEEKER PROFILE
export const createUpdateSeekerProfile = createAsyncThunk(
    "profile/createUpdateSeekerProfile",
    async ({ userId, profileData }) => {
       const res = await fetch(`http://localhost:5000/profile/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profileData)
        })
        if (!res.ok) {
            throw new Error("Failed to save profile");
        }

        return res.json();
    }
)

// UPLOAD RESUME
export const uploadResume = createAsyncThunk(
    "profile/uploadResume",
    async (formData) => {
        const res = await fetch("http://localhost:5000/resume/upload", {
            method: "POST",
            body: formData
        });
        if (!res.ok) {
            throw new Error("Upload failed");
        }
        return res.json();
    }
)

// GET USER RESUME
export const getUserResume = createAsyncThunk(
    "profile/getUserResume",
    async (userId) => {
        const res = await fetch(`http://localhost:5000/resume/${userId}`);
        if (!res.ok) {
            throw new Error("Failed to fetch resume");
        }
        return res.json();
    }
)

// UPDATE SEEKER PROFILE
// export const updateSeekerProfile = createAsyncThunk(
//     "profile/updateSeekerProfile",
//     async ({ userId, profileData }) => {
//         const res = await fetch(`http://localhost:5000/profile/${userId}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(profileData)
//         });
//         return res.json();
//     }
// );

// SLICE
const profileSlice = createSlice({
    name: "seekerProfile",
    initialState: {
        seekerProfile: null,
        resume: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchSeekerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSeekerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.seekerProfile = action.payload;
            })
            .addCase(fetchSeekerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Profile
            .addCase(createUpdateSeekerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUpdateSeekerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.seekerProfile = action.payload;
            })
            .addCase(createUpdateSeekerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(uploadResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.loading = false;
                state.resume = action.payload;
            })
            .addCase(uploadResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserResume.fulfilled, (state, action) => {
                state.loading = false;
                state.resume = action.payload;
            })
            .addCase(getUserResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
        // // Update Profile
        // .addCase(updateSeekerProfile.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(updateSeekerProfile.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.seekerProfile = action.payload;
        // })
        // .addCase(updateSeekerProfile.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // });
    }
});

export default profileSlice.reducer;