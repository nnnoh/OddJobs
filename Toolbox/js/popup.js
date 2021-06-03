import { copyUrl } from './util/markdownUtil.js'
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
            copyUrl(response, urlStyle);
            window.close();
        });
    });

    $('#imgHide').click(function () {
        sendMessageToContentScript({ cmd: 'imgHide' }, function (response) {
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