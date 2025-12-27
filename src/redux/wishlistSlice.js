import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';
import BASE_URL from '../api/config';
import axios from 'axios';

export const  fetchWishList = createAsyncThunk('wishlist/add-wishlist',async(_,{signal, rejectWithValue })=>{
    try {
      const token = JSON.parse(localStorage.getItem("auth_token"));
      if (!token) {
         return rejectWithValue("Please login to add product to cart!");
      }

      const response = await axios.get(`${BASE_URL}/get-wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
          signal, // <-- AbortController works automatically here
        }
      );
      return response.data;
    } catch (err) {
      if (axios.isCancel(err)) {  
        console.log("Fetch aborted");
        return;
      }
      return rejectWithValue(err.message);
    }
});

const wishlistSlice = createSlice({
    name:"wishlist",
    initialState:{
        wishlist:[],
        wishlistId:[],
        wishlistCount:0,
        loading:false,
        error:null,
    },
    reducers:{
      AddToWishlist:(state,action)=>{
        state.wishlist = action.payload;
        return state;
      },
      WishlistCounter:(state,action)=>{
        state.wishlistCount = action.payload;
        return state;
      },
      wishlistId:(state,action)=>{
        state.wishlistId = action.payload || [];
        return state;
      }
    },
    extraReducers:(builder)=>{
      builder
      .addCase(fetchWishList.pending,(state)=>{
        state.loading = true;
      })
      .addCase(fetchWishList.fulfilled,(state,action)=>{
        state.loading = false;
        state.wishlist = action.payload?.wishlist || action.payload || [];
        state.wishlistId = action.payload?.wishlist.map((i)=>i.product_id) || action.payload.map((i)=>i) || []
        state.wishlistCount = action.payload?.wishlist_count || 0;
      })
      .addCase(fetchWishList.rejected,(state,action)=>{
        state.error = action.error.message;
      });
    },
})

export const {AddToWishlist,WishlistCounter,wishlistId} = wishlistSlice.actions;
export const addToWishlistReducer = wishlistSlice.reducer;