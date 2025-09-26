import './App.css';
import { Allrouters } from './component/Allrouters';
import Navbar from './component/Navbar';
import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import "./css/common.css";
import "./css/navbar.css";
import "./css/home.css";
import "./css/footer.css";
import Footer from './component/Footer';

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Navbar></Navbar>
        <Allrouters></Allrouters>
        <Footer></Footer>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
