import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

//useParams is a React Hook. It allows functional components to access URL parameters

function ProductDetail() {
    const { id } = useParams(); //accessing the id of the route path from App.jsx 
    //With destructuring we're extracting a property from the object on the right
    // useParams always returns Key: value pairs
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

        // Attempt to parse the value to an integer (base 10)
        const parsedValue = parseInt(sanitizedValue, 10);

        // Rule 2: If parsed value is NaN (non-numeric input like "abc")
        // or if it's explicitly typed as '0' (e.g., user types '0', '00')
        // or if it's a valid number but leads to a visually "zero-like" state (e.g., '0' from '05')
        // we'll handle setting it to 0 or 1 later for non-valid.
        if (isNaN(parsedValue)) {
            // If the input is not a number, revert to 1 to prevent invalid state
            setQuantity(1);
        } else {
            // For valid numbers, ensure it's at least 0 (for typing purposes)
            // parseInt handles leading zeros (e.g., parseInt("05") returns 5)
            setQuantity(Math.max(0, parsedValue));
        }
    };

    const handleAddToCart = () => {
        console.log('handleAddToCart clicked in ProductDetail');
        if (product) { 
            // Ensure quantity is at least 1 before adding to cart
            // This is where the final validation for the cart operation happens.
            const quantityToAdd = Math.max(1, quantity);
            console.log('Adding product:', product.title, 'with quantity:', quantityToAdd);
            addToCart(product, quantityToAdd)
        } else {
        console.log('Product not loaded yet in ProductDetail.'); // <-- ADD THIS
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