import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import BASE_URL from '../api/config';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(`category/fetchCategories`,
    async (_,{ signal,rejectWithValue }) => {
        try{
            const response = await axios.get(`${BASE_URL}/categories`,{signal});
            return response.data.data;
        } catch(error){
            if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
                console.log('Request cancelled');
                return null; // or rejectWithValue('cancelled') if you want to track it
            }
            console.error('Error fetching categories:', error);
            return rejectWithValue(error.message);
        }
    }
);

const categorySlice = createSlice({
    name:'category',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            });
    }
})

export default categorySlice.reducer;