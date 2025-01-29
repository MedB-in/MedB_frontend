import { createSlice } from "@reduxjs/toolkit";

export const userAccessSlice = createSlice({
    name: 'userAccess',
    initialState: {
        userAccess: null,
    },
    reducers: {
        setUserAccess: (state, action) => {
            state.userAccess = action.payload;
        },
    },
})  

export const { setUserAccess } = userAccessSlice.actions;
export default userAccessSlice.reducer;