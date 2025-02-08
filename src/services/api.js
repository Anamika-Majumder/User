import axios from 'axios';

const userApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

const productApi = axios.create({
  baseURL: 'https://api.restful-api.dev'
});



// Add auth token to requests
const token = localStorage.getItem('auth_token');
if (token) {
  userApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  productApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const getUsers = () => userApi.get('/users');

export const getProducts = () => productApi.get('/objects');

export const addProduct = (product) => 
  productApi.post('/objects', product);

export const getProduct = (id) => 
  productApi.get(`/objects/${id}`);

export const deleteProduct = (id) => 
  productApi.delete(`/objects/${id}`);