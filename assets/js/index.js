$(function() {
    // 获取layui当中的模块
    const { layer } = layui;

    function getUserInfo() {

        axios.get('/my/userinfo').then(res => {
            console.log(res)
                // 校验请求失败
            if (res.status != 0) {
                return layer.msg('获取用户信息失败')
            }
            // 渲染用户信息
            // 获取用户名
            const { data } = res;
            const name = data.nickname || data.username;
            // 渲染昵称
            $('.nickname').text(`欢迎 ${name}`);
            // 渲染头像
            if (data.user_pic) {
                $('.avatar').prop('src', data.user_pic).show()
                $('.text-avatar').hide()
            } else {
                $('.text-avatar').text(name[0].toUpperCase()).show();
                $('.avatar').hide();
            }
        })
    }
    getUserInfo()

    // 点击退出
    $('#loginout').click(function() {
        // 清除本地存储
        localStorage.removeItem('token');
        // 跳转到登录界面
        location.href = './login.html'
    })





















})