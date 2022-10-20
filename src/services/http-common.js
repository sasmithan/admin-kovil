import axios from 'axios'
import store from '../store/index.js'
import router from '../router'
 
const Url = 'http://www.aalaiam.com/v1/'
const instance = axios.create({
    baseURL: Url,
    headers: {
        'Content-type': 'application/json',
    },
})

instance.interceptors.request.use(
    config => {
        if (store.getters["authUser/isLoggedIn"]) {
            config.headers.Authorization = 'Bearer ' + store.getters["authUser/token"]
        }
        return config
    }, error => Promise.reject(error));

instance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        const status = error.response.status;

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            router.push('/login')
            
            // if (store.getters["authUser/isRefreshing"]) {
            //     store.despatch("authUser/getAccessToken")
            //         .then(() => {
            //             originalRequest.headers['Authorization'] =
            //                 'Bearer ' + store.getters["authUser/token"];
            //             return instance.request(originalRequest);
            //         })
            //         .catch(() => {
            //             router.push('/login')
            //         })
            // } else {
            //     router.push('/login')
            // }
        }

        return Promise.reject(error);
    });

export default instance
