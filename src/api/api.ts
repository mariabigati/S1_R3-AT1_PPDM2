import axios from 'axios';
const api = axios.create({
    baseURL: 'https://restasaurus.onrender.com/api/v1'
});

export default api;