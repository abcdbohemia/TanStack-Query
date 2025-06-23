import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  //to define different URL's for different components or pages
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css'; 
import { CartProvider } from './context/CartContext.jsx';

const queryClient = new QueryClient();

//Rendering your React components in the actual HTML DOM of a web page
//StrictMode Highlights potential problems in your code during development

//while main.jsx doesn't directly import { Link } from 'react-router-dom', 
//it renders Navbar which does, and more importantly, App.jsx provides the 
//Routes component which responds to the URL changes initiated by Link 
//components operating within the overall BrowserRouter context.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <QueryClientProvider client={queryClient}> 
      <BrowserRouter>
      <CartProvider> {/* This is where children comes from */}
        <App />
      </CartProvider>     
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)