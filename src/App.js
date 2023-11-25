import React from 'react';
import Home from './components/Home';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';
import Login from './components/Lonin';


function App() {
  return(
   <>
   <Header/>
   <Routes>
    <Route path='/' element= {<Home/>}/>
    <Route path='/login' element= {<Login/>}/>
   </Routes>
   </>
  );
};

export default App;
