import { createAppSlice } from "../../app/createAppSlice";
import {} from "@reduxjs/toolkit"


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