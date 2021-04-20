/**************************************************/
let right = 0;
let left = 0;
var btnArray = new Array(); //或者写成：var btns= [];

jQuery('p').each(function (key, value) {

    btnArray[key] = $(this).val();

    var X = $(this).offset().top;
    var Y = $(this).offset().left;
});


/**************************************************/
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
    //鼠标坐标+眼动坐标
    let str = ("<div class=\'newDiv\'>" + x + 10 + "," + y +
        "<br>" + left + "," + right + "</br>" +
        "</div>");
    $("body").append(str);
    console.log("X和Y:  " + x + "  , " + y);
    console.log("left和right:  " + left + "  , " + right);
    var test = parseInt(left) + parseInt("20");
    console.log(test);
    $(".newDiv").css("left", parseInt(left) + parseInt("20") + +"px").css("top", parseInt(right) + parseInt("20") + "px").css("positive:absolute")/*.css("z-index","9999999999")*/;
}


/***********************获取光标位置文字***************************/
$(document).ready(function () {
    $(document).mousemove(function (e) {
        var $target = $(e.target);

        //    console.log("鼠标位置内容 原生 截取 ：  " + JSON.stringify($target.text()) + "\n");

    });
});

//跟随鼠标运行的函数
$(document).ready(function () {
    $(document).mousemove(function (e) {
        selectCursorWord(e);
    });
});

/**
 * 获取选中鼠标附近的文字
 * @param {MouseEvent} e
 * @returns {void}
 */
function selectCursorWord(e) {
    const x = left; //e.clientX; //left;
    const y = right;// e.clientY; //right;

    let offsetNode;
    let offset;

    const sel = window.getSelection()
    sel.removeAllRanges()

    if (document['caretPositionFromPoint']) {
        const pos = document['caretPositionFromPoint'](x, y)
        if (!pos) {
            return
        }
        offsetNode = pos.offsetNode
        offset = pos.offset
    } else if (document['caretRangeFromPoint']) {
        const pos = document['caretRangeFromPoint'](x, y)
        if (!pos) {
            return
        }
        offsetNode = pos.startContainer
        offset = pos.startOffset
    } else {
        return
    }

    if (offsetNode.nodeType === Node.TEXT_NODE) {
        const textNode = offsetNode
        const content = textNode.data
        //      console.log("鼠标位置内容 文本 截取 ：  " + JSON.stringify(textNode.data)) + "\n";
        const head = (content.slice(0, offset).match(/[-_a-z]+$/i) || [''])[0]
        const tail = (content.slice(offset).match(/^([-_a-z]+|[\u4e00-\u9fa5])/i) || [''])[0]
        if (head.length <= 0 && tail.length <= 0) {
            return
        }

        const range = document.createRange()
        range.setStart(textNode, offset - head.length)
        range.setEnd(textNode, offset + tail.length)
        const rangeRect = range.getBoundingClientRect()

        if (rangeRect.left <= x &&
            rangeRect.right >= x &&
            rangeRect.top <= y &&
            rangeRect.bottom >= y
        ) {
            sel.addRange(range)
        }

        range.detach()

    }
}


//眼动仪坐标实时获取
var socket;
if ("WebSocket" in window) {
    var ws = new WebSocket("ws://127.0.0.1:8181/test");
    socket = ws;
    ws.onopen = function () {
        console.log('连接成功');
        /*alert("连接成功, 请输入账号和密码");*/
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        var array = received_msg.split(',');
        left = array[0];
        right = array[1];
        console.log("眼动返回坐标：  " + array[0] + "," + array[1]) + "\n";
        //document.getElementById("showMes").value += received_msg + "\n";
    };
    ws.onclose = function () {
        alert("断开了连接");
    };
} else {
    alert("浏览器不支持WebSocket");
}

function func() {
    if (socket.readyState === 1) {           // 当前为只判断一次，可循环判断。
        socket.send("message");
    }
}

setInterval(function () {
    func();
}, 100)
