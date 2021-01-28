$(function() {
    // 点击链接  切换表单
    $('.link a').click(function() {
        $('.layui-form').toggle();
    })

    // 从layui中提取form模块
    const { form, layer } = layui;

    // 校验表单项
    form.verify({
            pass: [
                /^\w{6,12}$/,
                '密码只能在6~12位之间'
            ],
            // 判断两次输入密码是否一致
            samePass: function(value) {
                if (value != $('#pass').val()) {
                    return '两次输入密码不一致'
                }
            }
        })
        // 实现注册功能
    $('.reg-form').submit(function(e) {
            e.preventDefault();
            axios.post('/api/reguser', $(this).serialize())
                .then(res => {
                    console.log(res);
                    // status==0，则表示注册成功，反之失败
                    if (res.status != 0) {
                        return layer.msg('注册失败');
                    }
                    // 如果用户注册成功，则自动跳转到登录页面
                    layer.msg('注册成功');
                    $('.login-form a').click()
                })
        })
        // 实现登录功能
    $('.login-form').submit(function(e) {
        e.preventDefault();
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res);
                // status==0，则表示登录成功，反之失败
                if (res.status != 0) {
                    return layer.msg('登录失败');
                }
                // 用户登录成功，则将请求到的token保存到本地存储
                localStorage.setItem('token', res.token)
                    // 如果用户注册成功，则自动跳转到登录页面
                layer.msg('登录成功');
                // 跳转到首页
                setTimeout(function() {
                    location.href = './index.html'
                }, 1000)
            })
    })
})