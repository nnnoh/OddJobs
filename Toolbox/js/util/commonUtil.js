let MENU = {
    MENU_COPY_URL: {
        id: 'copy-url',
        title: 'Copy Url',
        cmd: 'pageInfo'
    },
    MENU_SHOW_TOOLBAR: {
        id: 'show-toolbar',
        title: 'Show Toolbar',
        cmd: 'showToolbar'
    },
    MENU_SHOW_DIR: {
        id: 'show-dir',
        title: 'Show Dir',
        cmd: 'showDir'
    }
}

/**
 * 函数防抖
 * @param {function} fn 需要防抖的函数
 * @param {number} delay 毫秒，防抖期限值
 * @returns 返回防抖函数
 */
function debounce(fn, delay) {
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(fn, delay);
    }
};

/**
 * 与一个（当前页或指定页） conten-script 交互
 * @param {*} message 消息
 * @param {*} callback 回调函数
 */
function sendMessageToContentScript(message, callback, tab) {
    // [javascript - How to handle "Unchecked runtime.lastError: The message port closed before a response was received"? - Stack Overflow](https://stackoverflow.com/questions/59914490/how-to-handle-unchecked-runtime-lasterror-the-message-port-closed-before-a-res)
    if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, message, function (response) {
            if (callback) callback(response);
        });
    } else {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            if (tabs.length == 0 || tabs.length > 1) {
                alert('标签页获取异常：' + JSON.stringify(tabs));
                return
            }
            chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                if (callback) callback(response);
            });
        });
    }
}

/**
 * Sleep
 * @param {number} time 
 * @returns Promise
 */
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 格式化时间
 * @param {string} fmt 
 * @returns string
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,               //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

export {
    debounce,
    sendMessageToContentScript,
    sleep,
    MENU
}