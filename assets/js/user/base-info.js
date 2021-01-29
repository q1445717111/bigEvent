$(function() {
    const { layer, form } = layui;

    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {
            // console.log(res);
            if (res.status != 0) {
                return layer.msg('获取失败')
            }
            const { data } = res;
            form.val('edit-userinfo', data);
        })
    }
    initUserInfo()

    // 表单验证
    form.verify({
        nick: [
            /^\S{1,6}$/, '昵称长度必须在1~6个字符之间'
        ]
    });
    // 提交信息
    $('.base-info-form').submit(function(e) {
        e.preventDefault();
        // 发送ajax请求
        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                console.log(res);
                // 判断是否修改成功
                if (res.status != 0) {
                    return layer.msg('修改信息失败')
                }
                layer.msg('修改用户信息成功');
                // 更新用户信息
                window.parent.getUserInfo();
            })
    })
    $('.layui-btn-primary').click(function(e) {
        e.preventDefault();
        initUserInfo();
    })



})