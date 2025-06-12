import React from 'react';
import { Link } from 'react-router-dom'; 

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">My E-commerce Shop</Link>
                <div>
                    <Link to="/products" className="navbar-link">Products</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;