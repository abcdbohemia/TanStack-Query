import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
//Calling createContext creates a "Context Object"
//this object has a Provider property, which is a React component

// {children} prop that CardProvider takes as its argment is refering to the descendents that it wraps in main.jsx
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState (() => {
        //Load cart from localStorage on initial load
        try {
            const localData = localStorage.getItem('cartItems'); //takes a string as an argument because it uses that string as a key to look up data.
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Failed to parse cart items from localStorage:", error);
            return [];
        }
    });

    //Save cartItems to local storage whenever it changes 
    //local storage can only store data as strings
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); //localStorage.setItem() always takes two string arguments: the key and the value.
    }, [cartItems]);

    //utility/action function 
    const addToCart = (product, quantityToAdd = 1) => {
        console.log('addToCart function in CartContext called for product:', product?.title, 'with quantity:', quantityToAdd);
        setCartItems(prevItems => {
        // when using the functional update form of a useState setter, the function you provide will always receive the 
        // previous state as its first argument from React, enabling you to base your new state on its most current value.
        console.log('Current cart items (prevItems):', prevItems);
        //find= "isolate"
        const existingItem = prevItems.find(item => item.id === product.id);
        let newCartItems;  //Variables must be declared before they are assigned a value (or at least before they are used in an expression that requires their value).
        if (existingItem) {
            //If item exists, increase quantity// //map method is used to create a new array by transforming each
            //element in an existing array//
            // ...item is the spread index which coppies all properties from the original item object
            //If you only mutated the array or its contained objects in place, React wouldn't "see" a 
            // change in the state variable's reference, and your UI wouldn't update.
            //any object or array that becomes part of your React state must be treated immutably. 
            // This applies not just to the top-level state variable (cartItems array itself) but also to the individual objects inside that array.
            newCartItems = prevItems.map(item => item.id === product.id ? { ...item, quantity:item.quantity + quantityToAdd } : item ); 
            // The map() method always generates a new array which contains a new object for the single modified item (with its updated quantity) and references 
            // to all the other original, unmodified items.
            // The array is what map returns, but the expressions inside the ternary are individual objects.
        } else {
            //If item is new, add it with quantity 1//
            // this will be done via ProductList 'product-card-button add-to-cart' button
            newCartItems = [...prevItems, {...product, quantity: quantityToAdd }];
        }
        console.log('New cart items (after update logic):', newCartItems);
        return newCartItems;    
    });
    };

    const removeFromCart = (productId) => {
        //filter="keep", it keeps only the elements from the original array that dont have the productId
        setCartItems(prevItems => prevItems.filter(item => item.id !==productId));
    };
    // Modifying or removing Quantity of Existing Items
    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            if (newQuantity <= 0) {
                return prevItems.filter(item => item.id !== productId); 
                //Remove if quantity is 0 or less
            }
            return prevItems.map(item => item.id === productId ? { ...item, quantity: newQuantity} : item );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    //Calculate total items for cart icon
    //reduce method reduces an array to a single value by iterating over each item in the [cartItems] array and adds its qantity to the accumulator
    //value, which initially is 0 . 
    // array.reduce(callbackFunction, initialValue);
    const getTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    //Calculate total price for cart summary
    const getTotalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    return (
        //The Provider property (CartContext.Provider) is the actual React component and a property of CartContext
        // "value"is a prop that you pass to this Provider component. 
        // This value prop contains the data and functions that the Provider makes available to its descendants.
        <CartContext.Provider value={{
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            getTotalItems, 
            getTotalPrice
        }}>
            {children} 
        </CartContext.Provider>
    );
};
// It's not enough for components (the {children}) to simply be "wrapped" by CartProvider in main.jsx. 
// They specifically need to be rendered inside the <CartContext.Provider> component to access the context's value.
// it's the internal rendering of {children} within <CartContext.Provider> 
// that grants App and its descendants in main.jsx access to the cart's contents.



// useContext is a React Hook, used to consume the values from a context
// useContext Hook is always used in conjunction with the Context object 
// that is created by the createContext() method
export const useCart = () => useContext(CartContext);

//You import and use the useCart hook (or any other context hook) only 
// in the functional React component (or custom hook) that specifically 
// needs to access or modify the information provided by that context.

// Even though you've set up the CartProvider (which internally uses <CartContext.Provider>) 
// to make the cart's value available throughout your application, individual components within 
// the App component (or any descendant of CartProvider) still need to import and use the 
// { useCart } hook to actually access and consume that context.