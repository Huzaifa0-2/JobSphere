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
        await fetch(`http://localhost:5000/profile/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profileData)
        })
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
            });
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