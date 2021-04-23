import { copyUrlForMd } from './util/markdownUtil.js'

var background = chrome.extension.getBackgroundPage();

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

function init(){
    $('#copyUrlForMd').click(function () {
        sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
            copyUrlForMd(response.title, response.url);
        });
    });

    setTimeout(function () {
        layui.form.render();

        layui.form.on('switch(elemDelSwitch)', function(data){
            sendMessageToContentScript({ 
                cmd: 'elemDelSwitch',
                enable: data.elem.checked
            });
        });
    }, 100);
}

init();