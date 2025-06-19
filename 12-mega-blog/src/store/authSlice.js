import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
 }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => { //this action will be dispatched when the user logs in
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        }
    }
})

export const { login, logout, setUserData } = authSlice.actions;

export default authSlice.reducer;