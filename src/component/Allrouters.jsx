import {Route,Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Product from '../pages/Product';
import SingleProduct from '../pages/SingleProduct';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Login from '../pages/Login';
import Profile from '../pages/Profile';

export const Allrouters = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/products" element={<Product></Product>}></Route>
                <Route path="/products/:slug" element={<SingleProduct></SingleProduct>}></Route>
                <Route path="/cart" element={<Cart></Cart>}></Route>
                <Route path="/wishlist" element={<Wishlist></Wishlist>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                <Route path="/profile" element={<Profile></Profile>}></Route>
            </Routes>
        </>
    )
}
