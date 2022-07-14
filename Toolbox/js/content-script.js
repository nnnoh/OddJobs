document.addEventListener('DOMContentLoaded', function () {
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
				if (lastTargetDom === null) {
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
		const $root = $(selector);
		if ($root.length === 0) {
			alert(`${selector} 未查找到dom元素`);
			return;
		}
		const $img = $root.find('img');
		$img.each((index, element) => {
			let btn = document.createElement("button");
			btn.setAttribute('id', 'btn' + index);
			btn.setAttribute('class', 'green-button');
			btn.innerText = '图片显示/隐藏'
			btn.onclick = () => {
				if (element.style.display === 'none') {
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

	/**
	 * 显示工具条
	 */
	function showToolbar() {
		if ($('#toolbar123').length > 0) {
			// 重置位置
			$('#toolbar123').css('left', '');
			$('#toolbar123').css('top', '');
			return;
		}
		const $body = $(document.body);
		// 注意区分 element.append 和 jquery 的 append 差异，前者对于被插入的 DOMString 对象等价为 Text 节点。
		$body.append(`<div id="toolbar123" class="toolbox toolbar">
			<div id="addSpeed" class="toolbar-btn">+</div>
			<div id="subSpeed" class="toolbar-btn">-</div>
			<div id="startScroll" class="toolbar-btn">go</div></div>`);

		initDragEvent('#toolbar123');

		initScrollBtnEvent('html');
		//显示目录
		// showDir('body');
	}

	/**
	 * 初始化滚动按钮事件
	 * @param {string} selector 滚动对象选择器
	 */
	function initScrollBtnEvent(selector) {
		const $div = $(selector);
		let speed = 100;
		let isRunning = false;
		$('#addSpeed').on('click', () => {
			speed += 25;
		});
		$('#subSpeed').on('click', () => {
			speed -= 25;
		});

		let lastValue;
		const scrollCall = () => {
			setTimeout(() => {
				if (!isRunning) {
					// 停止当前正在运行的动画。stopAll 参数停止被选元素的所有加入队列的动画。
					$div.stop(true);
					return;
				}
				$div.animate(
					{ scrollTop: $div.scrollTop() + speed },
					{
						duration: 500, easing: "linear",
						done: () => {
							// animate 不能移动了就停止（到边界 或 速度为 0）
							if (lastValue === $div.scrollTop()) {
								isRunning = false;
							}
						}
					}
				);
				lastValue = $div.scrollTop();
				scrollCall();
			}, 500);
		}
		$('#startScroll').on('click', () => {
			if (isRunning) {
				isRunning = false;
			} else {
				isRunning = true;
				scrollCall();
			}
		});

		// $('html') 的 scroll 事件无法触发，document.body / document / window 可以
		// 另， 鼠标滚动事件（标准：wheel，非标准：mousewheel，DOMMouseScroll）
		// $('html').on("wheel",()=>{console.log(111)});
		// 拖到滚动条不触发 wheel 事件
		// 另，window，document 上 animate 无效，直接 scrollTop 可以
		$(window).on('scroll', () => {
			if (isRunning && Math.abs(lastValue - $div.scrollTop()) > Math.abs(speed)) {
				// 人为滚动时暂定滚动动画
				$div.stop(true);
			}
		});
	}

	/**
	 * 初始化拖拽事件
	 * @param {string} selector 可拖拽元素选择器
	 */
	function initDragEvent(selector) {
		const $body = $(document.body);
		const $div = $(selector);

		// [js实现元素拖拽_wx612f42c0796f2的技术博客_51CTO博客](https://blog.51cto.com/u_15351653/3752535)
		// 优化可参考：[src/modules/layer.js · 贤心/layui - Gitee.com](https://gitee.com/sentsim/layui/blob/main/src/modules/layer.js)
		$div.on('mousedown', function (e) {
			let top = $div.prop('offsetTop'); //获取元素的top值
			let left = $div.prop('offsetLeft'); //获取元素的left值
			let y = e.clientY; //获取鼠标点击时的位置
			let x = e.clientX; //获取鼠标点击时的位置

			$body.on('mousemove', (e) => {
				$div.css({
					top: e.clientY - y + top + 'px',
					left: e.clientX - x + left + 'px'
				});
			});
		});
		$body.on('mouseup', (e) => {
			$body.off('mousemove');
		});

	}

	/**
	 * 目录显示
	 * @param {string} selector 文章dom元素选择器
	 */
	function showDir(selector) {
		const treeId = 'dir' + Math.floor((Math.random() * 100) + 1);
		const dirTree = new ArticleDirectory(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).getDirTree(selector)
		if (dirTree === null) {
			alert(`${selector} 未查找到标题`);
			return;
		}

		// 弹出目录
		// TODO layui 引入存在问题
		// , {
		// 	"matches": [
		// 		"http://*/*",
		// 		"https://*/*"
		// 	],
		// 	"js": [
		// 		"lib/layui/layui.js"
		// 	],
		// 	"css": [
		// 		"lib/layui/css/layui.css",
		// 		"lib/layui/css/modules/layer/default/layer.css"
		// 	],
		// 	"run_at": "document_idle"
		// }
		// "notifications"
		layui.layer.open({
			type: 1
			, content: `<div id="${treeId}"></div>`
			, skin: 'layui-layer-dir'
			, area: 'auto'
			// , maxHeight: 300
			, title: '目录'
			, closeBtn: true
			, offset: 'l' // 左边缘
			, shade: false
			, success: function (layero, index) {
				layui.tree.render({
					elem: '#' + treeId
					, data: dirTree
					, showLine: false  //是否开启连接线
					, click: function (obj) {
						scrollTop(obj.data.elem);
					}
				});

				// 设置显示位置
				// layui.layer.style(index, {
				// 	marginLeft: 15
				// });
			}
		});
	}

	/**
	 * dom 元素滚动到顶端
	 * @param {*} elem dom 元素
	 */
	function scrollTop(elem) {
		// todo
	}

	class ArticleDirectory {
		constructor(config) {
			this.config = config;
		}

		// 遍历html获取目录树
		getDirTree(selector) {
			const $titleArr = $(selector).find(this.config.join(','));
			let root = null;
			const stack = [];
			// [start, end) 层级的空目录入栈
			const pushNullObj = (start, end) => {
				for (let i = start; i < end; i++) {
					let tmpObj = {
						hierarchy: i,
						elem: null,
						title: '',
						children: []
					};
					if (stack.length > 0) {
						stack[stack.length - 1].children.push(tmpObj);
					}
					stack.push(tmpObj);
				}
			}

			for (let item of $titleArr) {
				let itemObj = {
					hierarchy: this.getHierarchy(item),
					elem: item,
					title: $(item).text(),
					children: []
				};

				// 弹出栈同级及以下目录
				for (let i = stack.length - 1; i >= 0; i++) {
					let lastObj = stack[stack.length - 1];
					if (lastObj.hierarchy < itemObj.hierarchy) {
						break;
					}
					stack.splice(i, 1);
				}
				pushNullObj(stack.length, itemObj.hierarchy);
				if (stack.length > 0) {
					stack[stack.length - 1].children.push(itemObj);
				}
				stack.push(itemObj);

				if (root === null) {
					root = stack[0];
				}
			}
			return root;
		}

		// 获取 目录 层级
		getHierarchy(elem) {
			for (let i = 0; i < this.config.length; i++) {
				if ($(elem).is(this.config[i])) {
					return i;
				}
			}
			return -1;
		}
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
					response.url = window.location.href;
					break;
				case 'elemDelSwitch':
					// dom元素删除
					if (request.enable) {
						document.addEventListener('dblclick', elementDelete);
					} else {
						document.removeEventListener('dblclick', elementDelete);
					}
					break;
				case 'imgHide':
					// 图片隐藏
					hideImg('article');
					break;
				case 'showToolbar':
					// 显示工具条
					showToolbar();
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