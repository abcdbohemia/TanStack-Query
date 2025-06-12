import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api'; 
import { Link } from 'react-router-dom';

function ProductList() {
    const { 
        data: products, 
        isLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    });

    if(isLoading) {
        return <div className="loading-message">Loading products...</div>;
    }
    if(isError) {
        return <div className="error-message">Error: {error.message}</div>;
    }

    return (
        <div className="product-list-grid">
            {products.map(product => (
                <div key={products.id} className="product-card">
                    <Link to={`/products/${product.id}`} className="product-card-link">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="product-card-image"
                        />
                    </Link>
                    <div className="product-card-info">
                        <h2 className="product-card-title">{product.title}</h2>
                        <p className="product-card-price">${product.price.toFixed(2)}</p>
                        <Link to={`/products/${product.id}`} className="product-card-button">View Details</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}