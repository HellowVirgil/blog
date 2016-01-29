//crypto 引入模块和 user.js 用户模型文件，crypto 是 Node.js 的一个核心模块，我们用它生成散列值来加密密码
/*var gravatar = require('gravatar'),
    moment = require('moment'),*/
var User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js'),
    exception = require('../lib/exception.js'),
    md5 = require('../lib/md5.js');

module.exports = function(app) {
    //把用户登录状态的检查放到路由中间件中，在每个路径前增加路由中间件，即可实现页面权限控制
    //我们添加 checkNotLogin 和 checkLogin 函数来实现这个功能
    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }

    //主页
    app.get('/', function (req, res, next) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回第 page 页的 10 篇文章
        Post.getTen(null, page, function (err, posts, total) {
            if (err) {
                return next(err);
            }
            //标签云
            Post.getTags(function (err, tags) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                //最热文章
                Post.getTenHot(function (err, hots) {
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/');
                    }
                    res.render('index', {
                        title: '主页',
                        posts: posts,
                        page: page,
                        tags: tags,
                        total: total,
                        hots: hots,
                        user: req.session.user,
                        keyword: null,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                });
            });
        });
    });

    //注册页
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');//返回注册页
        }
        //生成密码的 md5 值
        var password = md5(req.body.password);
        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email,
            age: req.body.age,
            gender: req.body.gender,
            message: req.body.message
        });
        //检查用户名是否已经存在
        User.get(newUser.name, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//注册失败返回主册页
                }
                req.session.user = user;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/');//注册成功后返回主页
            });
        });
    });

    //登陆页
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()});
    });
    app.post('/login', function (req, res) {
        //生成密码的 md5 值
        var password = md5(req.body.password);
        //检查用户是否存在
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');//登陆成功后跳转到主页
        });
    });

    //发表页
    app.get('/post', function (req, res) {
        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {
        var currentUser = req.session.user,
            tags = req.body.tags.split(";"),
            post = new Post(currentUser.name, currentUser.head, req.body.title, tags, req.body.post);
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/');//发表成功跳转到主页
        });
    });
    
    //登出
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');//登出成功后跳转到主页
    });

    //上传
    app.get('/upload', checkLogin);
    app.get('/upload', function (req, res) {
        res.render('upload', {
            title: '文件上传',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/upload', checkLogin);
    app.post('/upload', function (req, res) {
        req.flash('success', '文件上传成功!');
        res.redirect('/upload');
    });

    //存档
    app.get('/archive', function (req, res) {
        var cYear = new Date().getFullYear();
        var year = req.query.p ? (cYear - parseInt(req.query.p) + 1) : cYear;
        Post.getArchive(year, function (err, posts, total) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('archive', {
                title: '存档',
                posts: posts,
                year: year,
                page: cYear - year + 1,
                total: total,
                keyword: null,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    //某个标签的文章列表
    app.get('/tags/:tag', function (req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        Post.getTag(req.params.tag, page, function (err, posts, total) {
            if (err) {
                req.flash('error',err);
                return res.redirect('/');
            }
            res.render('tag', {
                title: '标签:' + req.params.tag,
                page: page,
                posts: posts,
                user: req.session.user,
                total: total,
                keyword: null,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    //检索
    app.get('/search', function (req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        Post.search(req.query.keyword, page, function (err, posts ,total) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('search', {
                title: "查询:" + req.query.keyword,
                posts: posts,
                page: page,
                user: req.session.user,
                total: total,
                keyword: req.query.keyword,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    //友链
    app.get('/links', function (req, res) {
        res.render('links', {
            title: '友情链接',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    //查询文章
    app.get('/u/:name', function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //检查用户是否存在
        User.get(req.params.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/');
            }
            //查询并返回该用户第 page 页的 10 篇文章
            Post.getTen(user.name, page, function (err, posts, total) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                debugger;
                res.render('user', {
                    title: user.name,
                    posts: posts,
                    page: page,
                    total: total,
                    user: req.session.user,
                    keyword: null,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
    });
    app.get('/u/:name/:day/:title', function (req, res) {
        Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('article', {
                title: req.params.title,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    //编辑用户信息
    app.get('/edit/u', checkLogin);
    app.get('/edit/u', function (req, res) {
        var currentUser = req.session.user;
        User.get(currentUser.name, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            res.render('editUser', {
                title: '用户信息',
                user: user,
                name: user.name,
                password: user.password,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.post('/edit/u', checkLogin);
    app.post('/edit/u', function (req, res) {
        var currentUser = req.session.user;
        var password = req.body.password,
            password_re = req.body['password-repeat'];
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect("/edit/u");
        }

        //生成密码的 md5 值
        if (password.length != 32) password = md5(password);
        var newUser = new User({
            name: currentUser.name,
            password: password,
            email: req.body.email,
            age: req.body.age,
            gender: req.body.gender,
            message: req.body.message
        });
        User.update(currentUser.name, newUser, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect("/edit/u");//出错
            }
            req.flash('success', '修改成功!');
            res.redirect("/edit/u");//成功
        });
    });

    //编辑文章
    app.get('/edit/:name/:day/:title', checkLogin);
    app.get('/edit/:name/:day/:title', function (req, res) {
        var currentUser = req.session.user;
        Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            res.render('edit', {
                title: '编辑',
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.post('/edit/:name/:day/:title', checkLogin);
    app.post('/edit/:name/:day/:title', function (req, res) {
        var currentUser = req.session.user;
        Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
            var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
            if (err) {
                req.flash('error', err);
                return res.redirect(url);//出错！返回文章页
            }
            req.flash('success', '修改成功!');
            res.redirect(url);//成功！返回文章页
        });
    });

    //删除文章
    app.get('/remove/:name/:day/:title', checkLogin);
    app.get('/remove/:name/:day/:title', function (req, res) {
        var currentUser = req.session.user;
        Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            var url = encodeURI('/u/' + req.params.name);
            res.redirect(url);
        });
    });

    //转载
    app.get('/reprint/:name/:day/:title', checkLogin);
    app.get('/reprint/:name/:day/:title', function (req, res) {
        Post.edit(req.params.name, req.params.day, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect(back);
            }
            var currentUser = req.session.user,
                reprint_from = {name: post.name, day: post.time.day, title: post.title},
                reprint_to = {name: currentUser.name, head: currentUser.head};
            Post.reprint(reprint_from, reprint_to, function (err, post) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('back');
                }
                req.flash('success', '转载成功!');
                var url = encodeURI('/u/' + post.name + '/' + post.time.day + '/' + post.title);
                //跳转到转载后的文章页面
                res.redirect(url);
            });
        });
    });

    //评论
    app.post('/u/:name/:day/:title', function (req, res) {
        var date = new Date(),
            time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
                date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":" +
                date.getSeconds();
        //游客头像
        var head = "/images/head.jpg";
        var comment = {
            name: req.body.name,
            head: head,
            time: time,
            content: req.body.content
        };
        var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
        newComment.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '留言成功!');
            res.redirect('back');
        });
    });

    //删除评论
    app.get('/removeComment/:name/:day/:title/:commenter/:time', checkLogin);
    app.get('/removeComment/:name/:day/:title/:commenter/:time', function (req, res) {
        Comment.remove(req.params.name, req.params.day, req.params.title, req.params.commenter, req.params.time, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '删除成功!');
            res.redirect('back');
        });
    });

    //404页面
    app.use(function (req, res) {
        res.status(404);
        res.render("404");
    });
};