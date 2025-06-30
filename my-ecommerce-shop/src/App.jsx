import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import './App.css';

//we're importing the {Link} with Navbar import
// Link is the trigger, while Route is the "destination"
// :id the colon makes id the name of that URL parameter

// while Routes and Route themselves are invisible control components, their effect 
// is to fill that visible <main> container with specific component (e.g., <ProductList>, 
// <ProductDetail>, <CartPage>) based on the current URL path.

function App() {
  return (
    <>
      <Navbar /> 
      <main className="app-main-content"> 
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} /> {/* :id is a dynamic segment accessible by useParams via RouterDom*/}
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<div><h1>404: Page Not Found</h1><p>Sorry, the page you are looking for does not exist.</p></div>} />
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