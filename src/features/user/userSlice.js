import {} from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice";


const initialState ={
    user: null,
    access_token: null,
    access_token_expires_at: null,
};

export const userSlice = createAppSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserProfile: (state, action) => {
            state.user = action.payload; 
        }
    }
})

export const { updateUserProfile  } = userSlice.actions;
export default userSlice.reducer;