var url = document.URL;
var nav = document.getElementsByClassName("am-nav")[0];
var li = nav.getElementsByTagName("li");

function searchPath(location) {
    for (var i = 0,len = li.length;i < len;i++) {
        var a = li[i].getElementsByTagName("a")[0];
        if (a) {
            li[i].className.splice("am-active");
            if (a.href == location) {
                li[i].className += "am-active";
            }
        }
    }
}

searchPath(url);