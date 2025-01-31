import { createSlice } from "@reduxjs/toolkit";
import { createTransform } from 'redux-persist';
import CryptoJS from 'crypto-js';

// Encryption transform
export const encryptTransform = createTransform(
    (inboundState) => {
        const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
        const encryptedState = CryptoJS.AES.encrypt(
            JSON.stringify(inboundState),
            encryptionKey
        ).toString();
        return encryptedState;
    },
    (outboundState) => {
        try {
            const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
            const bytes = CryptoJS.AES.decrypt(outboundState, encryptionKey);
            const decryptedState = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedState;
        } catch (e) {
            return outboundState;
        }
    },
    { whitelist: ['userAccess'] }
);

export const userAccessSlice = createSlice({
    name: 'userAccess',
    initialState: {
        userAccess: null,
    },
    reducers: {
        setUserAccess: (state, action) => {
            state.userAccess = action.payload;
        }
    },
});

export const { setUserAccess } = userAccessSlice.actions;
export default userAccessSlice.reducer;
