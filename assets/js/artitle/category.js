$(function() {
    // 定义弹出层id
    let index;
    const { form } = layui;
    // 从服务器获取文章列表数据，并渲染到页面
    getCateList();
    // 封装渲染的函数
    function getCateList() {
        // 发送ajax请求，获取图书列表
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            // 判断是否获取失败
            if (res.status != 0) {
                return layer.msg('获取分类列表失败！')
            }

            // 请求成功，渲染数据
            const htmlstr = template('tpl', res);
            // console.log(htmlstr);
            // 将获取到的元素添加到页面上
            $('tbody').html(htmlstr)
        })
    };

    $('#add-btn').click(function() {
        //   弹出窗口  如果是页面层
        index = layer.open({
            type: 1,
            title: '添加文章',
            area: ['500px', '280px'],
            content: $('.add-form-container').html() //这里content是一个普通的String
        });
    });

    // 绑定添加图书表单提交事件
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault();
        axios.post('/my/article/addcates',
            $(this).serialize()).then(res => {
            console.log(res);
            // 判断是否添加成功
            if (res.status !== 0) {
                return layer.msg('添加失败!')
            };
            layer.msg('添加成功');
            // 添加成功，关闭弹窗
            layer.close(index);
            // 再次调用渲染函数，获取列表的
            getCateList();
        });
    });
    //  给编辑按钮 绑定点击事件
    $(document).on('click', '.edit-btn', function() {
        //   弹出窗口  如果是页面层
        index = layer.open({
            type: 1,
            title: '编辑图书列表',
            area: ['500px', '280px'],
            content: $('.edit-form-container').html() //这里content是一个普通的String
        });
        console.log($(this).data('id'));
        // 获取当前点击的编辑按钮的id值
        const id = $(this).data('id');
        // 发送ajax请求  通过id获取图书列表
        axios.get(`/my/article/cates/${id}`).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            };
            //给表单赋值
            form.val("edit-form", res.data)
        });
        // 事件委托，监听修改表单提交事件
        $(document).on('submit', '.edit-form', function(e) {
            e.preventDefault();
            // 发送ajax请求，更新文章列表
            axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                // 添加成功，关闭弹窗
                layer.close(index);
                // 再次调用渲染函数，获取列表的
                getCateList();
            })
        });
    });
    // 事件委托，给删除按钮绑定点击事件
    $(document).on('click', '.del-btn', function() {
        // 获取当前点击的id
        const id = $(this).data('id');
        //弹出层
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 发送ajax请求
            axios.get(`/my/article/deletecate/${id}`).then(res => {
                console.log(res);
                // 判断是否删除成功
                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                };
                layer.msg('删除成功!');
                // 再次调用渲染函数，获取列表的
                getCateList();
            });
            // 关闭弹出层
            layer.close(index);
        });

    })
})