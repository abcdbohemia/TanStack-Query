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
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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