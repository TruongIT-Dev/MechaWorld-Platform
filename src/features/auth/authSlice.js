import { createAppSlice } from "../../app/createAppSlice";
import {}from "@reduxjs/toolkit"





const initialState ={
    isAuthenticated: false,
    user: null
};
export const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
        updateUserProfile: (state, action) => {
            state.user = action.payload; 
        }
    }   
})
export const { login, logout,updateUserProfile  } = authSlice.actions;
export default authSlice.reducer;