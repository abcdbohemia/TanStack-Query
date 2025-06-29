import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  //to define different URL's for different components or pages
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css'; 
import { CartProvider } from './context/CartContext.jsx';

const queryClient = new QueryClient(); //brain of React Query

// Rendering your React components in the actual HTML DOM of a web page
// document.getElementById('root') targets  <div id="root"></div> element in index.html and makes it a mount point for my React app //
// Set up the React environment on that specific HTML element using ReactDOM.createRoot()
// You then tell React what to render into that environment using the .render() method
// StrictMode Highlights potential problems in your code during development

// { Link } components, while not directly imported in main.jsx or App.jsx,
// are utilized by components App.jsx renders (e.g., Navbar). App.jsx's Routes component
// then dynamically responds to the URL changes initiated by these { Link }s.

//QueryClientProvider makes the 'queryClient' instance available to
//all child components via React Query hooks (e.g., useQuery, useMutation).
//This allows global access to data fetching, caching, and automatic management
//of loading, error, and success states for API calls throughout the entire app.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <QueryClientProvider client={queryClient}> 
      <BrowserRouter>
      <CartProvider> 
        <App />
      </CartProvider>     
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)

// CartProvider component comes from CartContext.jsx, it wrapps the APP component, which is its {children}
// Children components that are simply "wrapped" by <CartProvider> in main.jsx (or anywhere else) 
// cannot access the <CartProvider>'s value unless they are rendered inside the <CartContext.Provider> component.

