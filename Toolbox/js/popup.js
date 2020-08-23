var background = chrome.extension.getBackgroundPage();

$("#copyUrlForMd").click(function () {
    sendMessageToContentScript({ cmd: 'pageInfo' }, function (response) {
        copyUrlForMd(response.title, response.url);
    });
});

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}