const API_BASE_URL = 'http://fakestore.com';

//Helper function to handle fetch responses and errors
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() =>
        ({ message: 'Unknown error' })); //catch block will return this simple object
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);   
    }
    return response.json();
};

//Function to fetch all products with optional filters
export const fetchProducts = async (filters = {}) => {
    const params = new URLSearchParams();  //new object, a built-in browser API, makes it easier to construct URL query strings
    if (filters.limit) params.append('limit', filters.limit); //checks for limit property on filter object, if present, appends a limit parameter and its value to the URLSearchParams object
    if (filters.sort) params.append('sort', filters.sort);

    const url = filters.category? `${API_BASE_URL}/products/category/${filters.category}` 
    : `${API_BASE_URL}/products`;

    const response = await fetch(`${url}?${params.toString()}`);
    return
    handleResponse(response);
};
//So the URLSearchParams is what goes a the end of the url?


//Function to fetch a single product by ID
export const fetchProductById = async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    return
    handleResponse(response);
}

//Function to fatch all product categories 
export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/products/categories`); //returns all categories
    return
    handleResponse(response);
};

//Placeholder for future Mutation Functions (e.g. for an admin panel or cart)
export const createProduct = async (newProduct) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(newProduct),
    });
    return
    handleResponse(response);
    };

export const updateProduct = async (id, updatedProduct) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(updatedProduct),
    });
    return
    handleResponse(response);
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE', 
    });
    return 
    handleResponse(response);
}