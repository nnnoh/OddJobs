import { httpRequestUtil } from './util/httpUtil.js'
import { sleep } from './util/commonUtil.js'

let bmInfo = {
    // [id:0, title:"" ,children[{title:""书签栏"",...}, {title:""其他书签""...}],...]
    bookmarkTreeArr: null,
    urlLen: null,
    isChange: false
}

/**
 * 更新节点信息
 * 异步获取
 */
function upateBookmarks() {
    chrome.bookmarks.getTree(results => {
        bmInfo.bookmarkTreeArr = results
        bmInfo.urlLen = 0;
    });
}

/**
 * 获取dfs函数
 * @param {function(BookmarkTreeNode)} callback 
 * @returns dfs函数
 */
function getDfsFunc(callback) {
    let dfs = function (node) {
        if (!node) {
            return;
        }
        callback(node);
        if (isDir(node)) {
            for (const child of node.children) {
                dfs(child);
            }
        }
    }
    return dfs;
}

/**
 * 是否是目录
 * @param {BookmarkTreeNode} node 
 * @returns yes/no
 */
function isDir(node) {
    if (node && node.url == undefined
        && node.children instanceof Array) {
        return true;
    } else {
        return false;
    }
}

/**
 * 是否是http链接
 * @param {string} url
 * @returns yes/no
 */
function isHttpUrl(url) {
    if (url.startsWith('http')) {
        return true;
    }
    return false;
}

/**
 * url可用性测试
 */
async function testAvailabe() {
    if (bmInfo.bookmarkTreeArr != null) {
        const TEST_TOPIC = 'test-topic';
        // 测试结果数组
        let resultArr = [];
        // 请求发送数量
        let requestNum = 0
        // 请求发送完成数量
        let finishNum = 0;
        // 请求发送完成标志
        let finishFlag = false;
        // 延迟倍数
        let delayMul = 0;

        if (!isNaN($('#delayMul').val())) {
            delayMul = parseInt($('#delayMul').val());
        }

        let handler = (data) => {
            finishNum++;
            // 更新进度条
            layui.element.progress('loading', Math.round(finishNum / requestNum * 100) + '%');

            let isFind = false
            for (const record of resultArr) {
                if (record.id == data.id) {
                    record.isAvailable = data.isAvailable;
                    record.status = data.status;
                    isFind = true
                    break;
                }
            }
            if (!isFind) {
                console.log('非期望数据：', data);
            }
            if (finishFlag && (requestNum == finishNum)) {
                if (bmInfo.urlLen == 0) {
                    bmInfo.urlLen = finishNum
                }
                httpRequestUtil.unsubscribe(TEST_TOPIC, handler);

                // 完成测试
                let availNum = 0;
                for (const record of resultArr) {
                    if (record.isAvailable) {
                        availNum++;
                    }
                }
                $('#availRate').text(availNum + '/' + bmInfo.urlLen);
                layui.table.render({
                    elem: '#bookmarkList'
                    , data: resultArr
                    , page: true
                    , limits: [10, 20, 50, 100, 500, 1000]
                    , cols: [[
                        { type: 'checkbox' }
                        , { type: 'numbers' }
                        , { field: 'id', title: 'ID', width: 80, sort: true }
                        , { field: 'title', title: '标题', sort: true }
                        , { field: 'path', title: '路径', sort: true }
                        , { field: 'url', title: 'URL', sort: true }
                        , {
                            field: 'dateAdded', title: '收藏日期', sort: true, templet: record => {
                                return new Date(record.dateAdded).format('yyyy-MM-dd hh:mm:ss');
                            }
                        }
                        , {
                            field: 'isAvailable', title: '是否可用', sort: true, templet: record => {
                                return record.isAvailable ? '是' : '否'
                            }
                        }
                        , { field: 'status', title: '状态', sort: true }
                    ]]
                });

                $("#resultShow").show()
                $("#loading").hide()
            }
        }
        httpRequestUtil.subscribe(TEST_TOPIC, handler);
        // 目录栈
        let pathStack = [];

        let dfsCall = function (node) {
            if (!node) {
                return;
            }
            if (isDir(node)) {
                for (const child of node.children) {
                    pathStack.push(node.title);
                    dfsCall(child);
                    pathStack.pop();
                }
            } else {
                let id = node.id;
                requestNum++;
                resultArr.push({
                    id: id,
                    index: node.index,
                    dateAdded: node.dateAdded,
                    path: pathStack.join('/'),
                    title: node.title,
                    url: node.url,
                });

                // 判断是否是http请求
                if (!isHttpUrl(node.url)) {
                    httpRequestUtil.notify(TEST_TOPIC, {
                        id: id,
                        isAvailable: false,
                        status: 'not http'
                    });
                    return;
                }
                // test
                sleep(requestNum * delayMul).then(() => {
                    httpRequestUtil.notify(TEST_TOPIC, {
                        id: id,
                        isAvailable: true,
                        status: 'ok'
                    });
                });

                // 延迟请求
                // sleep(requestNum * delayMul).then(() => {
                //     httpRequestUtil.get({
                //         url: node.url
                //     }).done((data) => {
                //         httpRequestUtil.notify(TEST_TOPIC, {
                //             id: id,
                //             isAvailable: true,
                //             status: 'ok'
                //         });
                //     }).fail((xhr, status) => {
                //         httpRequestUtil.notify(TEST_TOPIC, {
                //             id: id,
                //             isAvailable: false,
                //             status: xhr.status + ': ' + xhr.statusText
                //         });
                //     });
                // });
            }
        };

        // 显示进度条
        layui.element.render();
        $("#resultShow").hide()
        $("#loading").show()
        for (const node of bmInfo.bookmarkTreeArr) {
            dfsCall(node);
        }
        // 当请求完成过快，finishFlag来不及设置为true，导致无法正常执行结束
        finishFlag = true;
    } else {
        alert('未获取到书签信息，请稍后重试！');
    }
}

function init() {
    chrome.bookmarks.onchange = function () {
        bmInfo.isChange = true;
    }
    upateBookmarks();

    setTimeout(function () {
        // 初始化输入框
        $('#delayMul').val(10);

        $('#testAvailable').click(() => {
            testAvailabe();
        });
    }, 100);
}

window.onload = function () {
    init();
};