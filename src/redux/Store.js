import {configureStore} from '@reduxjs/toolkit';
import categoryReducer from "./categorySlice";
import { addToCartReducer } from './cartSlice';
import { addToWishlistReducer } from './wishlistSlice';
import { addToUserReducer } from './userSlice';
import { addToOrderReducer } from './orderSlice';
import { addToAuthReducer } from './authSlice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    cart:addToCartReducer,
    wishlist:addToWishlistReducer,
    user:addToUserReducer,
    order:addToOrderReducer,
    auth:addToAuthReducer,
  },
});
