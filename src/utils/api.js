import axios from "axios";

import {BASE_URL} from "./url";
import {getToken, removeToken} from "./auth";

const API = axios.create({
    baseURL: BASE_URL
})

API.interceptors.request.use(config => {
    const {url} = config
    if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
        config.headers.authorization = getToken()
    }

    return config;
})

API.interceptors.response.use(response => {
    if (response.data.status === 400) {
        // token 失效，移除本地 token
        removeToken()
    }

    return response;
})

export {API}
