import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
//Calling createContext creates a "Context Object"
//this object has a Provider property, which is a React component

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState (() => {
        //Load cart from localStorage on initial load
        try {
            const localData = localStorage.getItem('cartItems'); 
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Failed to parse cart items from localStorage:", error);
            return [];
        }
    });

    //Save cart to local storage whenever it changes 
    //local storage can only store data as strings
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    //utility/action function 
    const addToCart = (product, quantityToAdd = 1) => {
        console.log('addToCart function in CartContext called for product:', product?.title, 'with quantity:', quantityToAdd);
        setCartItems(prevItems => {
        console.log('Current cart items (prevItems):', prevItems);
        //find= "isolate"
        const existingItem = prevItems.find(item => item.id === product.id);
        let newCartItems;
        if (existingItem) {
            //If item exists, increase quantity// //map method is used to create a new array by transforming each
            //element in an existing array//
            // ...item is the spread index which coppies all properties from the original item object
            //If you only mutated the array or its contained objects in place, React wouldn't "see" a 
            // change in the state variable's reference, and your UI wouldn't update.
            //any object or array that becomes part of your React state must be treated immutably. 
            // This applies not just to the top-level state variable (cartItems array itself) but also to the individual objects inside that array.
            newCartItems = prevItems.map(item => item.id === product.id ? { ...item, quantity:item.quantity + quantityToAdd } : item ); 
        } else {
            //If item is new, add it with quantity 1//
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

    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            if (newQuantity <= 0) {
                return 
                prevItems.filter(item => item.id !== productId); 
                //Remove if quantity is 0 or less
            }
            return prevItems.map(item => item.id === productId ? { ...item, quantity: newQuantity} : item );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };
    //Calculate total items for cart icon
    //reduce method iterates over each item and adds its qantity to the accumulator
    //value, which initially is 0 . 
    const getTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    //Calculate total price for cart summary
    const getTotalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return (
        //the value of the Provider property is an actual React component
        //CartContext object contains a component named Provider as one 
        // of its properties from the moment CreateContext() creates it.
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

//useContext is a React Hook, used to consume the values from a context
//useContext Hook is always used in conjunction with the Context object 
// that is created by the createContext() method
export const useCart = () => useContext(CartContext);

//You import and use the useCart hook (or any other context hook) only 
// in the functional React component (or custom hook) that specifically 
// needs to access or modify the information provided by that context.