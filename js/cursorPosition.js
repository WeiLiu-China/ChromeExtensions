let movex;
let movey; //用来接受鼠标位置的全局变量

$(document).ready(function () {
    $(document).mousemove(function (event) {
        //$("span").text(event.pageX + ", " + event.pageY);
        mousemove(event);
    });
});

function mousemove(e) {
    e = e || window.event;
    if (e.pageX || e.pageY) {
        movex = e.pageX;
        movey = e.pageY
    }
    creatDiv(movex, movey);
}

function creatDiv(x, y) {
    $(".newDiv").remove();
    let str = ("<div class=\'newDiv\'>" + x + "," + y + "</div>");
    $("body").append(str);
    $(".newDiv").css("left", x + "px").css("top", y + "px");
}