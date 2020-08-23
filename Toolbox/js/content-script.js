document.addEventListener('DOMContentLoaded', function () {
	let titleDom = document.getElementsByTagName('title');
	let title = titleDom.length > 0 ? titleDom.item(0).text : '';
	let url = window.location.href;

	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		var response = {};
		if (request.cmd == 'pageInfo') {
			response.title = title;
			response.url = url;
		}
		sendResponse(response);
	});
});