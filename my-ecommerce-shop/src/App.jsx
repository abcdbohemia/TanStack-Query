import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import './App.css';

//we're importing the Link with Navbar import
// Link is the trigger, while Route is the "destination"
// :id the colon makes id the name of that URL parameter
// Routes and Route are control components, they are not visible
//Route takes JSX element

function App() {
  return (
    <>
      <Navbar /> 
      <main className="app-main-content"> 
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} /> 
        </Routes>
      </main>
    </>
  );
}

export default App


//while App.jsx doesn't directly import { Link } from 'react-router-dom', 
// it renders Navbar which does, and more importantly, App.jsx provides 
// the Routes component which responds to the URL changes initiated by 
// Link components operating within the overall BrowserRouter context.