import axios from "axios";
import environment from "@/app/utils/environment";

const axiosInstancee = axios.create({
    baseURL: environment.IMAGE_KEY,
    headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "69420", // Ngrok skipping warning page
    "Access-Control-Allow-Origin": "*",
    },
});




axiosInstancee.interceptors.response.use(
    (response: any) => {
    return response;
    },
    (error: any) => {
    switch (error?.response?.status) {
        default:
        console.log(error.message);
        break;
    }
    return Promise.reject(error);
    }
);

export default axiosInstancee;