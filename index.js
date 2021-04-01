/**************************************************/

//实现输出该页面有多少张图片
var images = document.querySelectorAll('img');
console.log(images.length);
//ps：这个方法如果遇到页面里面很多图片可能要加载很久才能出来

var items = document.getElementsByTagName("p");
for (var i = 0; i < items.length; i++) {
    var value = items[i].firstChild.nodeValue;
    console.log(value);
}
;

/*var importJs = document.createElement("script"); //在页面新建一个script标签
importJs.setAttribute("type", "text/javascript");//给script标签增加type属性
importJs.setAttribute("src", 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js');
document.getElementsByTagName("head")[0].appendChild(importJs);*/

var items = document.getElementsByTagName("p");
for (var i = 0; i < items.length; i++) {
    var value = items[i].firstChild.nodeValue;
    console.log(value);
}

var btnArray = new Array(); //或者写成：var btns= [];

jQuery('p').each(function (key, value) {

    btnArray[key] = $(this).val();

    var X = $(this).offset().top;
    var Y = $(this).offset().left;
    console.log("top: " + X);
    console.log("left: " + Y);

    //或者也可以这么写：
    // btnArray[key] = $(value).val();
});


