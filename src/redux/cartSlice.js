import {createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:'cart',
    initialState:{
        cart:[],
        cartCount:0,
        cartTotal:0,
        loading:false,
        error:null,  
    },
    reducers:{
        AddToCart:(state,action)=>{
            // state.cart = [...state,action.payload]
            state.cart.push(action.payload)
            return state;
        },
        CartCounter:(state,action)=>{
            state.cartCount = action.payload;
            return state;
        },
        CartTotal:(state,action)=>{
            state.cartTotal = action.payload;
            return state;
        }
    }
})

export const {AddToCart,CartCounter,CartTotal} = cartSlice.actions;
export const addToCartReducer = cartSlice.reducer;