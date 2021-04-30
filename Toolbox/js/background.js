import { copyUrlForMd } from './util/markdownUtil.js'
import { MENU, sendMessageToContentScript } from './util/commonUtil.js'

/**
 * 初始化事件
 */
function initEvent() {
    chrome.contextMenus.onClicked.addListener(async (event, tab) => {
        if (event.menuItemId == MENU.MENU_COPY_URL_MD.id) {
            sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
                copyUrlForMd(response.title, response.url);
            }, tab);
        }
    })
}

chrome.runtime.onInstalled.addListener(function () {
    console.log('onInstalled: ', new Date())
    // 安装扩展时创建菜单
    chrome.contextMenus.create({
        id: MENU.MENU_COPY_URL_MD.id,
        title: MENU.MENU_COPY_URL_MD.title
    });
    initEvent();
})

chrome.runtime.onStartup.addListener(function () {
    console.log('onStartup: ', new Date())
    // 开启浏览器时添加右键菜单点击事件
    initEvent();
})