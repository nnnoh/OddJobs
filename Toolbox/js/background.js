// js引入
document.write("<script src='./js/tool/markdownTools.js'></script>");

chrome.contextMenus.create({
    title: "copy url with md style",
    onclick: function () {
        sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
            copyUrlForMd(response.title, response.url);
        });
    }
});

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}