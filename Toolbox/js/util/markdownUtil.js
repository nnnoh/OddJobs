let config = {
    // 是否弹出提示框
    isAlert: false
}

/**
 * 复制用于markdown的超链接
 * @param data 数据，{title:'', url: ''}
 * @param style 格式
 */
let copyUrl = function (data, style) {
    let urlStr = replaceByObj(data, style);
    copyToClipboard(urlStr);
}

/**
 * 使用对象属性替换字符串中的 ${prop}
 * @param {object} data 
 * @param {string} str 
 */
let replaceByObj = function (data, str) {
    // 转义 todo
    for (const prop in data) {
        str = str.replace('${' + prop + '}', data[prop]);
    }
    return str
}

/**
 * 将指定内容复制到粘贴板
 * @param 内容
 */
let copyToClipboard = function (text) {
    let textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        var successful = document.execCommand('copy');
        if (config.isAlert) {
            var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
            alert(msg);
        }
    } catch (err) {
        alert('该浏览器不支持点击复制到剪贴板');
    }
    document.body.removeChild(textarea);
}

export {
    copyUrl
}