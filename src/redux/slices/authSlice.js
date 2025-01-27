import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authenticated: false,
        userDetails: null, 
    },
    reducers: {
        setAuthenticated: (state, action) => {
            state.authenticated = action.payload;
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        }
    }
})

export const { setAuthenticated, setUserDetails } = authSlice.actions;
export default authSlice.reducer;