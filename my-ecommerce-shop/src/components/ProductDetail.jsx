import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

//useParams is a React Hook. It allows functional components to access URL parameters

function ProductDetail() {
    const { id } = useParams(); //destructuring useParams() to access the id of the route path from App.jsx 
    // useParams always returns Key: value pairs
    // The id value (123 in /products/123) is extracted by React Router during the route matching process.
    // This extracted id is then stored in React Router's internal context.
    // useParams() is the specific React Hook provided by react-router-dom that allows a functional component 
    // (like ProductDetail) to read this id value directly from React Router's context.
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const { 
        data: product,  
        isLoading, 
        isError, 
        error } = useQuery ({
            queryKey: ['product', id],
            queryFn: () => fetchProductById(id),   // were using an arrow fucntion because were passing the id 
            enabled: !!id, // if id is truthy, same as 'enabled: id'
        });

    
    // Handle input changes for quantity
    const handleQuantityChange = (e) => {
        const value = e.target.value; // This is the string from the input (e.g., "0", "5", "", "05")

        // STEP 1: Sanitize the input string to only allow digits (0-9)
        // This is crucial to prevent '.', 'e', or other non-digit characters from staying visually.
        //regular expression = powerful text pattern matching
        // /[^0-9]/  This is a regular expression literal
        const sanitizedValue = value.replace(/[^0-9]/g, ''); // Removes any character that is NOT a digit globally

        // Rule 1: If input is empty string, set state to 0. (Allows clearing the field)
        if (sanitizedValue === '') {
            setQuantity(0);
            return; // Exit early
        }

        // The main purpose of parseInt() is to convert a string (from sanitizedValue) into an integer (a whole number).
        const parsedValue = parseInt(sanitizedValue, 10);

        setQuantity(parsedValue);
    };

    const handleAddToCart = () => {
        console.log('handleAddToCart clicked in ProductDetail');
        if (product) { 
            // Ensure quantity is at least 1 before adding to cart
            // This is where the final validation for the cart operation happens.
            const quantityToAdd = Math.max(1, quantity);
            console.log('Adding product:', product.title, 'with quantity:', quantityToAdd);
            // addToCart function is in CartContext.jsx accessed through useCart()
            addToCart(product, quantityToAdd)
        } else {
        console.log('Product not loaded yet in ProductDetail.'); 
    }
    
    }   
    if (isLoading) {
        return <div className="loading-message">Loading product details...</div>;
    }

    if (isError) {
        return <div className="error-message">Error: {error.message}</div>;
    }

    if (!product) {
        return <div className="not-found-message">Product not found.</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail-card">
                <div className="product-detail-image-wrapper">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="product-detail-image"
                    />
                </div>
                <div className="product-detail-info">
                    <div>
                        <h1 className="product-detail-title">{product.title}</h1>
                        <p className="product-detail-category">{product.category}</p>
                        <p className="product-detail-price">${product.price.toFixed(2)}</p>
                        <p className="product-detail-description">{product.description}</p>
                    </div>
                    <div className="product-detail-actions">
                        <div className="quantity-selector">
                            <label htmlFor="quantity">Quantity:</label>
                            <input 
                                type="text"
                                id="quantity"
                                value={quantity === 0 ? '' : quantity}
                                onChange={handleQuantityChange}
                            />
                        </div>
                        <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
                        <Link to="/products" className="back-to-products-link">Back to Products</Link> 
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;