import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //Proxy all requests starting with /api to fakestoreapi.com
      //When your frontend makes a request to /api/products, 
      //Vite will forward it to https://fakestoreapi.com/products
      '/api': {
        target: 'https://fakestoreapi.com',
        changeOrigin: true, //Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\api/, ''), 
        //remove api prefix when forwarding
        secure: false 
        //Set to if target is HTTPS and you want to validate SSL certs
      },
    },
  },
});
