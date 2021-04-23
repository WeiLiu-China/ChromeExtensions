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
        console.log('连接成功');
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        setPosition(received_msg);
        //console.log("眼动返回坐标：  " + left + "," + right) + "\n";
    };
    ws.onclose = function () {
        alert("断开了连接");
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
        //TODObubian
        var top = screen.availHeight - window.innerHeight;
        left = parseInt(left * 1920);
        right = parseInt(right * 1080) - top;
        right = right.toFixed(one);
        left = left.toFixed(one);
        console.log("眼动平均坐标 ：  " + left + "," + right) + "\n";
        console.log("screen.availHeight - window.innerHeight ：  " + top) + "\n";
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
    /** Map 大小 **/
    var size = 0;
    /** 对象 **/
    var entry = new Object();

    /** 存 **/
    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            size++;
        }
        entry[key] = value;
    }

    /** 取 **/
    this.get = function (key) {
        if (this.containsKey(key)) {
            return entry[key];
        } else {
            return null;
        }
    }

    /** 删除 **/
    this.remove = function (key) {
        if (delete entry[key]) {
            size--;
        }
    }

    /** 是否包含 Key **/
    this.containsKey = function (key) {
        return (key in entry);
    }

    /** 是否包含 Value **/
    this.containsValue = function (value) {
        for (var prop in entry) {
            if (entry[prop] == value) {
                return true;
            }
        }
        return false;
    }

    /** 所有 Value **/
    this.values = function () {
        var values = new Array(size);
        for (var prop in entry) {
            values.push(entry[prop]);
        }
        return values;
    }

    /** 所有 Key **/
    this.keys = function () {
        var keys = new Array(size);
        for (var prop in entry) {
            keys.push(prop);
        }
        return keys;
    }

    /** Map Size **/
    this.size = function () {
        return size;
    }
}

var map = new HashMap();

function asynchronousSave(text) {
    var textNum = map.get(text);
    if (textNum !== null) {
        map.put(text, parseInt(textNum) + 1);
    } else {
        map.put(text, 1);
    }
}


setTimeout(function () {
    console.error("30秒观看排行  ：  " + JSON.stringify(map)) + "\n";
}, 30000);