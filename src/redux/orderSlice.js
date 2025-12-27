import { createSlice} from "@reduxjs/toolkit";

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