import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../api';         

function ProductDetail() {
    const { id } = useParams();

    const { 
        data: product, 
        isLoading, 
        isError, 
        error } = useQuery ({
            queryKey: ['product', id],
            queryFn: () => fetchProductById(id),   // were using an arrow fucntion because were passing the id 
            enabled: !!id,
        });
    if (isLoading) {
        return <div className="loading message">Loading product details...</div>;
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
                        <p className="product-detail-price">${product.price.toFix(2)}</p>
                        <p className="product-detail-description">{product.description}</p>
                    </div>
                    <div className="product-detail-actions">
                        <button className="add-to-cart-button">Add to Cart</button>
                        <Link to="/products" className="back-to-products-link">Back to Products</Link> ///we havent imported Link ???
                    </div>
                </div>
            </div>
        </div>
    );
}