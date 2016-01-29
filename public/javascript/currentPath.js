//curent path
var url = document.URL;
var li = $("#collapse-head .am-nav li");
var a = li.children("a");

function searchPath(location) {
    for (var i = 0,len = li.length;i < len;i++) {
        li[i].className = li[i].className.split("am-active").join("");
        if (a[i].href && a[i].href == location) {
            li[i].className += " am-active";
        }
    }
}

searchPath(url);

//article页跳转
var comments = $("hr.am-article-divider");
var commitComments = $("commit-comments");

