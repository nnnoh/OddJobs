let config = {
    // 是否弹出提示框
    isAlert: false
}

/**
 * 复制用于markdown的超链接
 * @param title 标题
 * @param url 链接
 */
let copyUrlForMd = function (title, url) {
    let urlStr = '[' + title + '](' + url + ')';
    copyToClipboard(urlStr);
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
        if (config.isAlert){
            var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
            alert(msg);
        }
    } catch (err) {
        alert('该浏览器不支持点击复制到剪贴板');
    }
    document.body.removeChild(textarea);
}

export {
    copyUrlForMd
}