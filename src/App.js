import React from 'react';
import Home from './components/Home';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';
import Login from './components/Lonin';
import ForgotPassword from './components/ForgotPassword';
import Contact from './components/Contact';
import About from './components/About';


function App() {
  return(
   <>
   <Header/>
   <Routes>
    <Route path='/' element= {<Home/>}/>
    <Route path='/login' element= {<Login/>}/>
    <Route path='forgot-password' element= {<ForgotPassword/>} />
    <Route path='contact' element= {<Contact/>} />
    <Route path='about' element= {<About/>} />
   </Routes>
   </>
  );
};

export default App;
