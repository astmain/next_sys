import axios from "axios";

// 创建axios实例
const axios_instance = axios.create({
  baseURL: "http://127.0.0.1:60001",
  // timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// 请求拦截器
axios_instance.interceptors.request.use(
  (config) => {
    // 添加认证令牌
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios_instance.interceptors.response.use(
  (response) => {
    // 可统一处理响应数据
    return response.data;
  },
  (error) => {
    // 可统一处理错误
    // alert(error.message)
    return Promise.reject(error);
  }
);

export const axios_api = axios_instance;

