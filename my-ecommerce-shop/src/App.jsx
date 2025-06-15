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
