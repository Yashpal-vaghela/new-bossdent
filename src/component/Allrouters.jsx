import {Route,Routes} from 'react-router-dom';
import Home from '../pages/Home';

export const Allrouters = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
            </Routes>
        </>
    )
}
