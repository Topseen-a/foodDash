import axios from 'axios'; 
const api= axios.create({ 
    baseURL:import.meta.env.VITE_API_URL|| 'http://localhost:8080/api/v1', }); 
    
    // Attach JWT token automatically to every request. 
    api.interceptors.request.use(config=> { 
        consttoken=localStorage.getItem('token'); 
        if (token)
            config.headers.Authorization=`Bearer${token}`; 
        returnconfig; }); 
        
        // 401 means token expired— clear storage and redirect to login. 
        api.interceptors.response.use( response=>response, error=>{
            if (error.response?.status===401){ 
                localStorage.removeItem('token'); 
                localStorage.removeItem('user'); 
                window.location.href='/login'; } 
                return Promise.reject(error); } ); 
                
export default api;