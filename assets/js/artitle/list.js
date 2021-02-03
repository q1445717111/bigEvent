$(function() {
    const { form, laypage } = layui;
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

    const query = {
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: ''
    };
    // 发送请求到服务器，获取文章列表数据
    renderTable();

    function renderTable() {
        // 发送请求
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败!')
            };
            layer.msg('获取文章列表成功!');
            // 调用模板引擎之前 注册过滤器  修改时间格式
            template.defaults.imports.dateFormat = function(date) {
                return moment(date).format('YYYY-MM-DD HH:mm:ss')
            }


            // 使用模板引擎渲染
            const htmlStr = template('tpl', res);
            // 添加到tbody中
            $('tbody').html(htmlStr);

            // 渲染分页器
            renderPage(res.total);
        })
    };
    // 把服务器获取的数据，渲染成分页器
    function renderPage(total) {
        laypage.render({
            elem: 'pagination', //注意，这里是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize,
            limits: [1, 2, 3, 4, 5], //每页条数的选择项 array
            curr: query.pagenum, //当前的页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 当分页被切换时触发，函数返回两个参数：
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                query.pagenum = obj.curr;
                query.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    renderTable();
                }
            }

        });
    };
    // 表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        // 获取下拉选择框中的属性值和状态
        const cate_id = $('#cate-se1').val();
        const state = $('#state').val();
        // console.log(cate_id, state);
        // 把获取到的值重新赋值给query对象
        query.state = state;
        query.cate_id = cate_id;
        // 发送请求前  修改代码值为1
        query.pagenum = 1;
        // 重新渲染列表

        renderTable();
    });
    // 事件委托，给删除按钮绑定点击事件
    $(document).on('click', '.del-btn', function() {
        // 获取当前点击的id
        const id = $(this).data('id');
        //弹出层
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 发送ajax请求
            axios.get(`/my/article/delete/${id}`).then(res => {
                console.log(res);
                // 判断是否删除成功
                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                };
                layer.msg('删除成功!');
                // 判断删除的图书是否为当前页唯一一条数据且不处于第一页
                if ($('.del-btn').length == 1 && query.pagenum != 1) {
                    // 如果是 则请求上一页的内容
                    query.pagenum -= 1;
                };
                // 再次调用渲染函数，获取列表的
                renderTable();
            });
            // 关闭弹出层
            layer.close(index);
        });

    });
    // 点击编辑按钮  跳转到edit。html 页面
    $()
    $(document).on('click', '.edit-btn', function() {
        // 获取当前点击项的自定义属性  id值
        const id = $(this).data('id');
        // 使用查询参数 把当前id值传递到编辑页面
        location.href = `./edit.html?id=${id}`;
        // 点击编辑按钮 触发发表文章的高亮事件
        window.parent.$('.layui-this').prev().find('a').click();
    })



})