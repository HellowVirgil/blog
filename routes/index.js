module.exports = function(app) {
    //主页
    app.get('/',function(req,res) {
        //渲染模版，并将其产生的页面直接返回给客户端
        res.render('index',{title: 'VirgilZone'});
    });
    //注册页
    app.get('/reg', function (req, res) {
        res.render('reg', { title: '注册' });
    });
    app.post('/reg', function (req, res) {
    });
    //登陆页
    app.get('/login', function (req, res) {
        res.render('login', { title: '登录' });
    });
    app.post('/login', function (req, res) {
    });
    //发表页
    app.get('/post', function (req, res) {
        res.render('post', { title: '发表' });
    });
    app.post('/post', function (req, res) {
    });
    //登出
    app.get('/logout', function (req, res) {
    });
};