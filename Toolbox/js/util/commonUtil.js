let MENU = {
    MENU_COPY_URL_MD: {
        id: 'copy-url-md',
        title: 'Copy Url with Md Style'
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
 * 与 conten-script 交互
 * @param {*} message 消息
 * @param {*} callback 回调函数
 */
function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

export {
    debounce,
    sendMessageToContentScript,
    MENU
}