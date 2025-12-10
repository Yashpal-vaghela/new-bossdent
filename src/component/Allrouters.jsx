import {Route,Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Product from '../pages/Product';
import SingleProduct from '../pages/SingleProduct';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Category from '../pages/Category';
import { TermAndCondition } from '../pages/TermAndCondition';
import { PrivacyPolicy } from '../pages/PrivacyPolicy';
import { RefundPolicy } from '../pages/RefundPolicy';
import { HelpCenter } from '../pages/HelpCenter';
import { ReturnExchange } from '../pages/ReturnExchange';
import { Contact } from '../pages/Contact';
import { Checkout } from '../pages/Checkout';
import ProtectedRoute from './ProtectedRoute';
import { OrderHistory } from '../pages/OrderHistory';
import { Success } from '../pages/payment/Success';
import { Settings } from '../pages/Settings';
import { About } from '../pages/About';

export const Allrouters = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/about" element={<About></About>}></Route>
                <Route path="/products" element={<Product></Product>}></Route>
                <Route path="/products/:slug" element={<SingleProduct></SingleProduct>}></Route>
                <Route path="/category/:slug" element={<Category />}></Route>
                <Route path="/cart" element={<Cart></Cart>}></Route>
                <Route path="/checkout" element={<ProtectedRoute><Checkout></Checkout></ProtectedRoute>}></Route>
                <Route path="/wishlist" element={<Wishlist></Wishlist>}></Route>
                <Route path="/contact" element={<Contact></Contact>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                <Route path="/profile" element={<Profile></Profile>}></Route>
                <Route path="/order-history" element={<OrderHistory></OrderHistory>}></Route>
                <Route path="/order-history/:id" element={<OrderHistory></OrderHistory>}></Route>
                <Route path="/settings" element={<Settings></Settings>}></Route>
                <Route path="/help-center" element={<HelpCenter></HelpCenter>}></Route>
                <Route path="/privacy-policy" element={<PrivacyPolicy></PrivacyPolicy>}></Route>
                <Route path="/terms-and-conditions" element={<TermAndCondition></TermAndCondition>}></Route>
                <Route path="/refund-and-returns-policy" element={<RefundPolicy></RefundPolicy>}></Route>
                <Route path="/return-exchange" element={<ReturnExchange></ReturnExchange>}></Route>
                <Route path="/payment/success" element={<Success></Success>}></Route>
                <Route path="*" element={<Home/>}></Route>
            </Routes>
        </>
    )
}
