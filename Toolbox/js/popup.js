import { copyUrlForMd } from './util/markdownUtil.js'
import {sendMessageToContentScript} from './util/commonUtil.js'

// var background = chrome.extension.getBackgroundPage();

function init(){
    layui.element.render()

    $('#copyUrlForMd').click(function () {
        sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
            copyUrlForMd(response.title, response.url);
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