// 为全局的axios设置根路径
axios.defaults.baseURL = 'http://ajax.frontend.itheima.net'
    // 添加全局的请求拦截器
axios.interceptors.request.use(function(config) {
    // console.log('发送ajax请求前', config);
    // 获取本地存储的token令牌
    // console.log(config.url);
    // 在发送请求前判断是否以 /my 开头
    if (config.url.startsWith('/my')) {
        const token = localStorage.getItem('token') || '';
        config.headers.Authorization = token;
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    console.log('接收ajax响应');
    const { message, status } = response.data;
    if (message == '身份认证失败！' && status == 1) {
        localStorage.removeItem('token');
        location.href = './login.html';
    }
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});