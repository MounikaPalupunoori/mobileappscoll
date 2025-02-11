import axios from 'axios';
import { baseURL } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: baseURL ,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

axiosInstance.interceptors.request.use(
   async (config) => {
    const Token =  await AsyncStorage.getItem("token")
        if(Token){
            config.headers.Authorization = `Bearer ${Token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;