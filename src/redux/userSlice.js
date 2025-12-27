import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import BASE_URL from "../api/config";
import axios from "axios";

export const fetchUser = createAsyncThunk("user/fetchUser",async(__dirname,{signal,rejectWithValue})=>{
    try{
        const token = JSON.parse(localStorage.getItem("auth_token"));
        if(!token){
            return rejectWithValue({
              status:401,
              message:"Please login to add product to user!"
            });
        }

        const response = await axios.get(`${BASE_URL}/get-user-data`,{
            headers:{
                Authorization: `Bearer ${token}`.replace(/\s+/g," ").trim(),
                "Content-Type":"application/json",
            },
            signal,
        });
        return response.data;
    }catch(err){
        console.log("err-----------------------------------",err)
        if (axios.isCancel(err)) return rejectWithValue({ status: 0, message: "Request cancelled" });

        if(err.response){
          const status = err.response.status;
            const serverMessage = err.response.data?.message || err.response.data?.error || err.response.statusText || "Server error";

            if(status === 401 || status === 403){
              return rejectWithValue({
                status,
                message: serverMessage || "Authentication error — please log in again.",
              });
            }
            return rejectWithValue({status, message: serverMessage});
        }
        
        return rejectWithValue({ status: 0, message: err.message || "Unknown error" });
    }
});

const userSlice = createSlice({
    name:'user',
    initialState:{
        user:{},
        loading:false,
        error:null,
    },
    reducers:{
       AddToUser:(state,action)=>{
        state.user = action.payload || {};
        return state;
       },
       ClearUser(state){
        state.user = [];
        state.error = null;
       }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(fetchUser.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload.data || action.payload || {}; 
        })
        .addCase(fetchUser.rejected,(state,action)=>{
            console.log("rejected",action.error,action.payload);
            state.loading = false;
            if(action.payload){
              state.error = action.payload;
            }else{
              state.error = {status:500, message:action.error?.message || "Request failed"};
            }
        });
    },
})

export const {AddToUser,ClearUser} = userSlice.actions;
export const addToUserReducer = userSlice.reducer;