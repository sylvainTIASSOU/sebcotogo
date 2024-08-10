import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

type InitialState = {
    value: AuthState
}
type AuthState = {
    isAuth?: boolean,
    uid: string,
    role: string,
    name: string;
}

const initialState = {
    value: {
        isAuth: false,
        uid: "",
        role: "",
        name: "",
    } as AuthState
} as  InitialState

const persistConfig = {
    key: 'root',
    storage,
};

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut: (state) => {
            return {
                ...state, // Conserver d'autres slices de l'état
                value: initialState.value, // Réinitialiser seulement auth
            };
        },

        logIn: (state, action: PayloadAction<AuthState>) => {
            return {
                value: {
                    isAuth: true,
                    uid: action.payload.uid,
                    role: action.payload.role,
                    name: action.payload.name,
                }
            }
        }
    }
})


// Wrapping the reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, auth.reducer);

export const { logIn, logOut } = auth.actions
export default persistedReducer;

