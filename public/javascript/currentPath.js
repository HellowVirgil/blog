var url = document.URL;
var nav = document.getElementsByClassName("nav")[0];
var li = nav.getElementsByTagName("li");

function searchPath(location) {
    for (var i = 0,len = li.length;i < len;i++) {
        var a = li[i].getElementsByTagName("a")[0];
        if (a) {
            a.className = null;
            if (a.href == location) {
                a.className = "current-link";

            }
        }
    }
}

searchPath(url);