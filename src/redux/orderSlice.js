import { createSlice} from "@reduxjs/toolkit";
// import BASE_URL from "../api/config";

const orderSlice = createSlice({
    name:"order",
    initialState:{
        order:[],
    },
    reducers:{
        AddToOrder:(state,action)=>{
            state.order = action.payload || [];
            return state;
        }
    }
})
export const {AddToOrder} = orderSlice.actions;
export const addToOrderReducer = orderSlice.reducer;