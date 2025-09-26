import {Route,Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Product from '../pages/Product';

export const Allrouters = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/products" element={<Product></Product>}></Route>
            </Routes>
        </>
    )
}
