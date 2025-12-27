import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import BASE_URL from "../api/config";
import axios from "axios";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { signal, rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("auth_token"));
      if (!token) {
         return rejectWithValue("Please login to add product to cart!");
      }

      const response = await axios.get(`${BASE_URL}/get-cart`, {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
          signal, // <-- AbortController works automatically here
        }
      );

      return response.data; 
    } catch (err) {
      if(err.response?.status === 401 || err.response?.status === 403){
        localStorage.removeItem("auth_token");
        return rejectWithValue('TOKEN EXPIRED');
      }
      if (axios.isCancel(err)) {  
        // console.log("Fetch aborted");
        return;
      }
      
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
    name:'cart',
    initialState:{
        cart:{items:[]},
        cartCount:0,
        cartTotal:0,
        deliveryCharge:0,
        loading:false,
        error:null,  
    },
    reducers:{
        AddToCart:(state,action)=>{
            state.cart = action.payload || {items:[]};
            state.deliveryCharge = state.cart.cart_total <= 2300 ? 90 : 0 || 0; 
            state.cartTotal = state.cart.cart_total || action.payload.cart_total;
            state.cartCount = state.cart.cart_count || action.payload.cart_count;
            return state;
        },
        DeleteCart:(state,action)=>{
          return state;
        },
        CartTotal:(state,action)=>{
            state.cartTotal = action.payload;
            return state;
        },
        DeliveryCharge:(state,action)=>{
          state.deliveryCharge = action.payload || 0;
          return state;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            // Set cart data from backend
            state.cart = action.payload?.cart || action.payload || [{items:[]}];
            state.cartTotal = action.payload?.cart_total || 0;
            state.cartCount = action.payload?.cart_count || 0;
            state.deliveryCharge = state.cartTotal <= 2300 ? 90 : 0 || 0; 
        })
        .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
  },
})

export const {AddToCart,DeleteCart,CartTotal,DeliveryCharge} = cartSlice.actions;
export const addToCartReducer = cartSlice.reducer;