import { copyUrl, copyToClipboard } from './util/markdownUtil.js'
import { sendMessageToContentScript } from './util/commonUtil.js'

// var background = chrome.extension.getBackgroundPage();

var urlStyle = 'no init'

/**
 * 初始化数据
 */
function initData() {
    chrome.storage.local.get({
        urlStyle: 'no! this is error! run!',
        elemDelSwitch: true
    }, function (items) {
        urlStyle = items.urlStyle
        $('#urlStyle').val(urlStyle);
        $('#elemDelSwitch').attr('checked', items.elemDelSwitch)
        layui.form.render();
    });
}

function init() {
    layui.element.render();
    initData();

    $('#copyUrl').click(function () {
        sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
            if ($('#urlStyle').val().trim() != urlStyle) {
                urlStyle = $('#urlStyle').val().trim()
                chrome.storage.local.set({ 'urlStyle': urlStyle });
            }
            copyUrl(response, urlStyle, true);
            window.close();
        });
    });

    $('#copyAllUrl').click(function () {
        // 更新 urlStyle
        if ($('#urlStyle').val().trim() != urlStyle) {
            urlStyle = $('#urlStyle').val().trim()
            chrome.storage.local.set({ 'urlStyle': urlStyle });
        }

        let message = { cmd: 'pageInfo' };
        // 对所有 tab
        chrome.tabs.query({}, function (tabs) {
            if (tabs.length == 0) {
                alert('无打开的标签页');
                return
            }
            let tabsLen = tabs.length;
            let count = 0;
            let resultArr = new Array(tabsLen);
            let callback = function(response, i) {
                resultArr[i] = copyUrl(response, urlStyle);
                count++;
                if (count == tabsLen) {
                    // 完成
                    copyToClipboard(resultArr.join('\n'));
                    window.close();
                }
            }
            for (let i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, message, function (response) {
                    callback(response, i);
                });
            }
        });
    });

    $('#imgHide').click(function () {
        sendMessageToContentScript({ cmd: 'imgHide' }, function (response) {
            window.close();
        });
    });
    
    $('#showToolbar').click(function () {
        sendMessageToContentScript({ cmd: 'showToolbar' }, function (response) {
            window.close();
        });
    });

    $('#bookmarksFunc').click(function () {
        chrome.tabs.create({
            url: '/html/bookmarks.html'
        });
    });

    setTimeout(function () {
        // layui.form.render();

        layui.form.on('switch(elemDelSwitch)', function (data) {
            chrome.storage.local.set({ 'elemDelSwitch': data.elem.checked });
            sendMessageToContentScript({
                cmd: 'elemDelSwitch',
                enable: data.elem.checked
            });
        });
    }, 100);
}

init();