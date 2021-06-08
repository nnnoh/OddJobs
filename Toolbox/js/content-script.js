document.addEventListener('DOMContentLoaded', function () {
	let url = window.location.href;

	/**
	 * 获取网页标题
	 * @returns 网页标题
	 */
	function getTitle() {
		let titleDom = document.getElementsByTagName('title');
		let title = titleDom.length > 0 ? titleDom.item(0).text.trim() : '';
		return title;
	}

	/**
	 * 获取两 Dom 的最近公共父 Dom
	 * @param {HTMLElement} elementA Dom元素A
	 * @param {HTMLElement} elementB Dom元素B
	 * @returns 最近公共父 Dom
	 */
	function lowestCommonAncestor(elementA, elementB) {
		if (elementA.contains(elementB)) {
			return elementA;
		} else if (elementB.contains(elementA)) {
			return elementB;
		} else {
			let node = elementA.parentElement;
			while (true) {
				if (node.contains(elementB)) {
					return node;
				}
				node = elementA.parentElement;
			}
		}
	}

	// 上一次点击的 dom
	let lastTargetDom = null

	/**
	 * 删除 Dom 元素
	 * @param {MouseEvent} event 
	 */
	function elementDelete(event) {
		// 按住 ctrl 时双击，删除鼠标位置 dom
		// 按住 ctrl+alt 时双击，删除两次鼠标位置的最近公共父 dom
		if (event.ctrlKey) {
			if (event.altKey) {
				if (lastTargetDom == null) {
					lastTargetDom = event.target;
				} else {
					lowestCommonAncestor(lastTargetDom, event.target).remove();
					lastTargetDom = null;
				}
			} else {
				event.target.remove();
			}
		}
	}

	/**
	 * 图片显示/隐藏
	 * @param {string} selector 
	 */
	function hideImg(selector) {
		$img = $(selector).find('img')
		$img.each((index, element) => {
			let btn = document.createElement("button");
			btn.setAttribute('id', 'btn' + index);
			btn.setAttribute('class', 'green-button');
			btn.innerText = '图片显示/隐藏'
			btn.onclick = event => {
				if (element.style.display == 'none') {
					element.style.display = 'block';
				} else {
					element.style.display = 'none';
				}
			};
			element.style.display = 'none';
			// 有的parent是a标签，按钮放这里时，点击会触发页面跳转
			element.parentElement.append(btn);
		});
	}

	function init() {
		chrome.storage.local.get({
			elemDelSwitch: true
		}, function (items) {
			if (items.elemDelSwitch) {
				document.addEventListener('dblclick', elementDelete);
			}
		});


		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			let response = {};
			response.status = '200'
			switch (request.cmd) {
				case 'pageInfo':
					// 返回页面信息
					response.title = getTitle();
					response.url = url;
					break;
				case 'elemDelSwitch':
					if (request.enable) {
						document.addEventListener('dblclick', elementDelete);
					} else {
						document.removeEventListener('dblclick', elementDelete);
					}
					break;
				case 'imgHide':
					// todo 手动输入
					hideImg('article');
					break;
				default:
					response.status = '404'
					break;
			}
			sendResponse(response);
		});
	}

	init();
});