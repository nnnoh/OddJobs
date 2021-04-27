import { copyUrlForMd } from './util/markdownUtil.js'
import { MENU, sendMessageToContentScript} from './util/commonUtil.js'

/**
 * 初始化
 */
function init() {
    // 右键菜单
    chrome.contextMenus.create({
        id: MENU.MENU_COPY_URL_MD.id,
        title: MENU.MENU_COPY_URL_MD.title
    });

    chrome.contextMenus.onClicked.addListener(async (event, tab) => {
        if (event.menuItemId == MENU.MENU_COPY_URL_MD.id) {
            sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
                copyUrlForMd(response.title, response.url);
            });
        }
    })
}

chrome.runtime.onInstalled.addListener(function(){
    init();
})