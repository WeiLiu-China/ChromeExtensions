/**************************************************/
let right = 0;
let left = 0;
var btnArray = new Array(); //或者写成：var btns= [];
const time = 100;

jQuery('p').each(function (key, value) {

    btnArray[key] = $(this).val();

    var X = $(this).offset().top;
    var Y = $(this).offset().left;
});


/**************************************************/
let movex;
let movey; //用来接受眼睛位置的全局变量

$(document).ready(function () {
    $(document).mousemove(function (event) {
        event = event || window.event;
        if (event.pageX || event.pageY) {
            movex = event.pageX;
            movey = event.pageY
        }
    });
});

function creatDiv() {
    x = movex;
    y = movey;
    //眼睛坐标
    var x_10 = parseInt(x) + parseInt("10");
    let str = ("<div class=\'newDiv\'>" + x_10 + "," + parseInt(y) +
        "<br>" + left + "," + right + "</br>" +
        "</div>");
    //console.log("X和Y:  " + x_10 + "  , " + y);
    // console.log("left和right:  " + left + "  , " + right);
    var left_20 = parseInt(left) + parseInt("25");
    var right_20 = parseInt(right + parseInt("25"));
    $(".newDiv").remove();
    $("body").append(str);
    $(".newDiv").css("left", left_20 + "px").css("top", right_20 + "px").css("positive:absolute");
}

function creatEyeDiv() {
    $(".eyeDiv").remove();
    //眼睛坐标
    let str = ("<div class=\'eyeDiv\'>" + "</div>");
    $("body").append(str);
    $(".eyeDiv").css("left", left + "px").css("top", right + "px").css("positive:absolute");
}

setInterval(function () {
    selectCursorWord();
    creatDiv();
    creatEyeDiv();
}, time)

/**
 * 获取选中眼睛附近的文字
 * @param {MouseEvent} e
 * @returns {void}
 */
function selectCursorWord() {
    const x = left;
    const y = right;

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
        var textData = JSON.stringify(textNode.data)
        console.log("眼睛位置内容 文本   ：  " + JSON.stringify(textNode.data)) + "\n";
        setTimeout(function () {
            asynchronousSave(textData)
        }, 10);
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
        console.log('脚本 已连接 ');
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        setPosition(received_msg);
        //console.log("眼动返回坐标：  " + left + "," + right) + "\n";
    };
    ws.onclose = function () {
        alert("脚本 已断开 ");
    };
} else {
    alert("浏览器不支持WebSocket");
}

function setPosition(received_msg) {
    var array = received_msg.replace(/\s*/g, "").split(',');
    //console.log("眼动返回坐标 ：  " + received_msg) + "\n";
    const one = 1;
    left_x = array[0];
    left_y = array[1];
    right_x = array[2];
    right_y = array[3];
    if (left_x !== "nan") {
        left = left_x;
        right = left_y;
    }
    if (right_x !== "nan") {
        left = right_x;
        right = right_y;
    }

    if (right_x !== "nan" & left_x !== "nan") {
        left = (Number(right_x) + Number(left_x)) / 2;
        right = (Number(right_y) + Number(left_y)) / 2;
        //console.log("眼动平均坐标 ：  " + left + "," + right) + "\n";
    }
    if (right_x !== "nan" || left_x !== "nan") {
        //TODO bubian
        var top = Number(screen.height) - Number(screen.availHeight) + window.screenTop;
        left = parseInt(left * screen.width) - (window.screenLeft + screen.width);
        right = parseInt(right * screen.height) - top;
        right = right.toFixed(one);
        left = left.toFixed(one);
    }

}

function func() {
    if (socket.readyState === 1) {           // 当前为只判断一次，可循环判断。
        socket.send("message");
    }
}

setInterval(function () {
    func();
}, time)


function HashMap() {
    this.map = {};
}

HashMap.prototype = {
    put: function (key, value) {// 向Map中增加元素（key, value)
        this.map[key] = value;
    },
    get: function (key) { //获取指定Key的元素值Value，失败返回Null
        if (this.map.hasOwnProperty(key)) {
            return this.map[key];
        }
        return null;
    },
    remove: function (key) { // 删除指定Key的元素，成功返回True，失败返回False
        if (this.map.hasOwnProperty(key)) {
            return delete this.map[key];
        }
        return false;
    },
    removeAll: function () {  //清空HashMap所有元素
        this.map = {};
    },
    keySet: function () { //获取Map中所有KEY的数组（Array）
        var _keys = [];
        for (var i in this.map) {
            _keys.push(i);
        }
        return _keys;
    }
};
HashMap.prototype.constructor = HashMap;

const map = new HashMap();

function asynchronousSave(text) {
    var textNum = map.get(text);
    if (textNum !== null) {
        map.put(text, parseInt(textNum) + 1);
    } else {
        map.put(text, 1);
    }
    // console.log("  map" + JSON.stringify(map));

}


setTimeout(function () {
    console.log("30秒观看排行  ：  " + JSON.stringify(map)) + "\n";
}, 30000);

setTimeout(function () {
    localStorage.setItem('map', JSON.stringify(map));
    alert("已收集10秒数据，请查看!");
}, 10000);