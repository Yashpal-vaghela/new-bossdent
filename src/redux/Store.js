import {configureStore} from '@reduxjs/toolkit';
import categoryReducer from "./categorySlice";
import { addToCartReducer } from './cartSlice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    cart:addToCartReducer
  },
});
