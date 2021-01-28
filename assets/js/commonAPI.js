// 为全局的axios设置根路径
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'
    // 添加全局的请求拦截器
axios.interceptors.response.use(function(config) {
    console.log('发送ajax请求');
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    console.log('接收ajax响应');
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});