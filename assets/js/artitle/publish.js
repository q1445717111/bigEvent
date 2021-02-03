$(function() {
    // 声明一个全局状态变量
    let state = '';
    const { form } = layui;
    // 封装获取文章分类列表的函数
    function getCateList() {
        // 发送ajax请求，获取文章分类
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取文章分类失败!')
            };
            // 遍历数组，渲染下拉组件的选项
            res.data.forEach(item => {
                // 将遍历到的元素动态追加到下拉选择框中
                $('#cate-se1').append(`<option value="${item.Id}">${item.name}</option>`)
            })
            form.render(); //更新渲染全部表单  layui提供
        })
    }
    getCateList();
    // 初始化富文本编辑器
    initEditor();

    // 获取要裁剪的图片
    const $image = $('#image');

    $image.cropper({
        aspectRatio: 480 / 280,
        preview: '.img-preview'
    });

    // Get the Cropper.js instance after initialized
    // var cropper = $image.data('cropper');

    // 3. 初始化裁剪区域
    // $image.cropper(options)

    // 点击选择封面按钮，触发文件上传框点击事件
    $('#choose-btn').click(function() {
        $('#files').click();
    });
    // 给文件选择框绑定change事件
    $('#files').change(function() {
        console.log(this.files[0]);
        // 把图片文件转成url地址的形式
        imgUrl = URL.createObjectURL(this.files[0]);
        // 把预览区的图片替换为当前上传的图片
        console.log(imgUrl);
        $image.cropper('replace', imgUrl);
    });
    // 监听表单提交事件
    $('.publish-form').submit(function(e) {
        e.preventDefault();
        // 获取表单中所有的内容
        const fd = new FormData(this);
        // 检测formdata中的数据是否获取成功
        fd.forEach(item => {
            console.log(item);
        });
        // 向fd中新增文章状态数据
        fd.append('state', state);

        $image.cropper('getCroppedCanvas', {
            // 指定裁剪后的图片宽高
            width: 400,
            height: 280
        }).toBlob(blob => {
            console.log(blob);
            // 把获取的图片数据添加到formData中
            fd.append('cover_img', blob);
            // 调用函数，提交数据到服务器
            publishArticle(fd);
        })

    })

    // 点击发布/存为草稿按钮  获取当前state状态
    $('.last-row button').click(function() {
        // console.log($(this).data("state"));
        // 获取点击按钮的自定义属性值
        state = $(this).data("state");
    });
    // 在外层封装一个发布文章请求的函数，参数为formdata数据
    function publishArticle(fd) {
        axios.post('/my/article/add', fd).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('发布文章失败!')
            };
            layer.msg(state == '草稿' ? '保存草稿成功' : '发布文章成功!');
            // 文章发表成功 跳转到文章列表页面
            location.href = './list.html';
            window.parent.$('.layui-this').next().find('a').click();
        })
    }



})