import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api'; 
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductList.css';

function ProductList() {
    const { addToCart } = useCart(); //directly accesses the value object that is provided by the CartContext.Provider.
    const {     // Object Destructuring
        data: products,   
        isLoading, 
        isError, 
        error 
    } = useQuery({   // useQuery is a function, to run it, you must call it with useQuery(...)
        queryKey: ['products'],  // { } is an object literal that you are creating on the spot and passing as that single argument to the useQuery function.
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
                <div key={product.id} className="product-card">
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
                        <button onClick={() => {
                            console.log('Add to Cart clicked in ProductList for product:', product.title);
                            addToCart(product)}} className="product-card-button add-to-cart">
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductList;