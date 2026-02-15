import { useState } from 'react'
import React from 'react';
import './App.css';
import Navbar from "./components/Navbar";
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProductViewPage from './pages/ProductViewPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ItemsPage from './pages/ItemsPage.jsx';
import Cart from './pages/Cart.jsx'; 
import 
{ 
  Route,
  Routes } 
  from 'react-router-dom';
import AdminPage from './pages/AdminPage.jsx';




function App() {

return (
   <div className='app'>
    
    <Navbar/>
    
    <Routes>
         <Route element={<HomePage/>} path='/'/> 
          <Route element={<ItemsPage/>} path='/ItemsPage'/>
          <Route element={<LoginPage/>} path='/Loginpage'/>
          <Route element={<ProductViewPage/>} path='/Productviewpage'/>
          <Route element={<RegisterPage/>} path= '/Registerpage'/>
          <Route element={<AdminPage/>} path='/adminpage'/>
          <Route element={<Cart/>} path='/cart'/>
          
    </Routes>
   

  
   </div>
  )
}

export default App
