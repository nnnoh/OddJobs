const defaultOption = {
    type: 'GET',
    // timeout: 10000,
    // "user-agent": '',
}

function HttpRequestUtil() {
    // 订阅事件
    this.eventListeners = {};
}

HttpRequestUtil.prototype = {
    subscribe: function (topic, callback) {
        if(!this.eventListeners[topic]){
            this.eventListeners[topic] = [];
        }
        this.eventListeners[topic].push(callback);
    },
    unsubscribe: function (topic, callback) {
        if(!this.eventListeners[topic]){
            return
        }
        this.eventListeners[topic] = this.eventListeners[topic].filter(el => {
            if (el != callback){
                return el
            }
        });
    },
    notify: function (topic, data, thisObj) {
        if(!this.eventListeners[topic]){
            return
        }
        var scope = thisObj || window;
        this.eventListeners[topic].forEach(el => {
            el.call(scope, data);
        });
    },
    get: function (config) {
        return $.ajax($.extend(defaultOption, config));
    }
}

let httpRequestUtil = new HttpRequestUtil;

export {
    httpRequestUtil
}