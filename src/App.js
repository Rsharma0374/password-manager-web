import React from 'react';
import Home from './components/signup/Home';
import Header from './components/header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';
import Login from './components/login/Login';
import ForgotPassword from './components/forgotPassword/ForgotPassword';
import Contact from './components/contact/Contact';
import About from './components/about/About';
import Dashboard from './components/dashboard/Dashboard'
import Footer from './components/footer/Footer';


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
    <Route path='dashboard' element= {<Dashboard/>} />
   </Routes>
   <Footer/>
   </>
  );
};

export default App;
