$(function() {
    // 获取要裁剪的图片
    const $image = $('#image');
    // 初始化裁剪区域
    $image.cropper({
        // 指定的长宽比
        aspectRatio: 1,
        // 裁剪事件
        crop: function(event) {
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        },
        preview: '.img-preview'

    });

    // 点击上传按钮，自动触发选择文件点击事件
    $('#upload-btn').click(function() {
        $('#file').click();
    });
    // 监听文件框状态改变事件
    $('#file').change(function() {
        console.log(this.files);
        // 判断用户是否上传
        if (this.files.length == 0) {
            return
        }

        // 把图片文件转成url地址的形式
        const imgUrl = URL.createObjectURL(this.files[0]);
        console.log(imgUrl);
        $image.cropper('replace', imgUrl)
    });
    // 点击确定，上传图片到服务员
    $('#save-btn').click(function() {
        // 获取裁剪后图片的base64格式的字符串
        const dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg');
        console.log(dataUrl);
        // 手动构建查询参数字符串
        const search = new URLSearchParams();
        search.append('avatar', dataUrl);
        // 发送ajax请求
        axios.post('/my/update/avatar', search).then(res => {
            console.log(res);
            if (res.status != 0) {
                return layer.msg('上传失败')
            }
            layer.msg('上传成功');
            window.parent.getUserInfo();
        })
    })











})