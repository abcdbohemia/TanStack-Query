import React from 'react';
import { Link } from 'react-router-dom'; 
import { useCart } from  '../context/CartContext';
import './Navbar.css';

//Link is a React component that is imported from react-router-dom
function Navbar() {
    const { getTotalItems } = useCart();
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">My E-commerce Shop</Link> 
                <div className="navbar-links">
                    <Link to="/products" className="navbar-link">Products</Link>
                    <Link to="/cart" className="navbar-link cart-link">Cart ({getTotalItems})</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

