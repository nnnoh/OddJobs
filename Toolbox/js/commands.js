import { copyUrl } from './util/markdownUtil.js'
import { MENU, sendMessageToContentScript} from './util/commonUtil.js'

// 快捷键事件
chrome.commands.onCommand.addListener(async command => {
    if (command == MENU.MENU_COPY_URL_MD.id) {
        sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
            copyUrl(response.title, response.url, true);
        });
    }
})
