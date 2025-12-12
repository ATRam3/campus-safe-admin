import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// // Handle expired token / unauthorized access
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {


  
//   }
// );

export default api;
