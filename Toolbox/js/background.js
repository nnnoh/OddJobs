import { copyUrl } from './util/markdownUtil.js'
import { MENU, sendMessageToContentScript } from './util/commonUtil.js'

/**
 * 初始化事件
 */
function initEvent() {
    chrome.contextMenus.onClicked.addListener(async (event, tab) => {
        if (event.menuItemId == MENU.MENU_COPY_URL.id) {
            sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
                chrome.storage.local.get({urlStyle: 'no! this is error! run!'}, function(items) {
                    copyUrl(response, items.urlStyle, true);
                });
            }, tab);
        }
    })
}

chrome.runtime.onInstalled.addListener(function () {
    console.log('onInstalled: ', new Date())
    // 安装扩展时创建菜单
    chrome.contextMenus.create({
        id: MENU.MENU_COPY_URL.id,
        title: MENU.MENU_COPY_URL.title
    });
    // 初始化数据
    chrome.storage.local.set({
        'urlStyle': '[${title}](${url})',
        'elemDelSwitch': true
    });
})

initEvent();