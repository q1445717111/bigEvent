$(function() {
    const { form } = layui;
    form.verify({
        pass: [
            /^\w{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        confirmPass: function(val) {
            if (val != $('#pass').val()) {
                return '两次密码输入不一致'
            }
        }
    });
    // 发送ajax请求
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        axios.post('/my/updatepwd', $(this).serialize()).then(res => {
            console.log(res);
            // 判断用户是否修改失败
            if (res.status != 0) {
                return layer.msg('修改密码失败');

            }
            // 提示用户
            layer.msg('修改密码成功');
            // 修改完成 跳转到登录界面
            window.parent.location.href = '../login.html';
            // 清除本地存储的数据
            localStorage.removeItem('token')
        })
    })
















})