import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PERSIST, PURGE, REGISTER, PAUSE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';
import userAccessSlice from './slices/userAccessSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'userAccess'],
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);
const persistedUserAccessReducer = persistReducer(persistConfig, userAccessSlice);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        userAccess: persistedUserAccessReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
});

export const persistor = persistStore(store);
