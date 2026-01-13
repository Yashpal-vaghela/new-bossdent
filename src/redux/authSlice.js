import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:"auth",
    initialState:{
        token:JSON.parse(localStorage.getItem("auth_token")) || null,
    },
    reducers: {
       AddToken:(state,action)=>{
        state.token = action.payload;
        // localStorage.setItem("auth_token", JSON.stringify(action.payload));
       },
       getToken:(state,action)=>{
        return state.token;
       }
    },  
})

export const { AddToken,getToken } = authSlice.actions;
export const addToAuthReducer = authSlice.reducer;