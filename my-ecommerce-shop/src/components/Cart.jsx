import React from "react";
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; //for "continue shopping" button
//import './Cart.css'; //We'll create this CSS


//For a component such as this Cart.js to access a context's value (from CartContext.jsx) 
// and subscribe to its updates, it must be rendered as a descendant of the Context.Provider 
// and explicitly consume the context using the useContext hook (useCart()).
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  // If the cart is empty, display a different message
  if (cartItems.length === 0) {
    return (
      <div className="cart-container cart-empty">
        <h2>Your Shopping Cart</h2>
        <p>Your cart is currently empty. Start shopping!</p>
        <Link to="/products" className="continue-shopping-button">Continue Shopping</Link>
      </div>
    );
  }

  // If the cart has items, display the full cart details
  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items-list">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <Link to={`/products/${item.id}`} className="cart-item-image-link">
              <img src={item.image} alt={item.title} className="cart-item-image" />
            </Link>
            <div className="cart-item-details">
              <Link to={`/products/${item.id}`} className="cart-item-title-link">
                <h3>{item.title}</h3>
              </Link>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
              <div className="cart-item-quantity-controls">
                {/* Button to decrease quantity */}
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1} // Disable if quantity is 1 to prevent going below 1 via this button
                >
                  -
                </button>
                <span>{item.quantity}</span>
                {/* Button to increase quantity */}
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              {/* Button to remove item directly */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="cart-item-remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Cart summary section */}
      <div className="cart-summary">
        <h3>Total: ${getTotalPrice.toFixed(2)}</h3>
        <div className="cart-actions">
          <button onClick={clearCart} className="clear-cart-button">Clear Cart</button>
          <button className="checkout-button">Proceed to Checkout (Mock)</button>
        </div>
        <Link to="/products" className="continue-shopping-button">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default Cart;