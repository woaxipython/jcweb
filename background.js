function createContextMenuItems() {
    const documentUrlPatterns = [
        "*://*.xiaohongshu.com/*",
        "*://*.xiaohongshu.cn/*",
        "*://*.sogou.com/*",
        "*://*.sogou.cn/*"
    ];

    const menuItems = [
        {id: "selectAllInput", title: "全选", contexts: ["all"], documentUrlPatterns},
        {id: "saveLink", title: "保存竞品", contexts: ["link"], documentUrlPatterns},
        {id: "saveAllLinks", title: "保存所有已选链接", contexts: ["all"], documentUrlPatterns}
    ];

    menuItems.forEach(item => {
        // 首先尝试删除具有相同 ID 的菜单项
        chrome.contextMenus.remove(item.id, () => {
            // 检查是否有错误
            if (chrome.runtime.lastError) {
                console.warn(`No existing menu item with id ${item.id} to remove.`);
            }
            // 删除后创建新的菜单项
            chrome.contextMenus.create(item, () => {
                if (chrome.runtime.lastError) {
                    console.error(`Error creating menu item: ${chrome.runtime.lastError}`);
                }
            });
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    createContextMenuItems();
});


// 处理菜单点击事件的本地函数
function handleMenuClick(menuItemId, linkUrl, tabId) {
    // 接收到菜单点击事件后，回传到content.js中进行执行，不在这里处理
    switch (menuItemId) {
        case "saveLink":
            getSpecificCookiesForActiveTab(function (cookiesData) {
                chrome.tabs.sendMessage(tabId, {
                    action: 'promptProductName',
                    linkUrl: linkUrl,
                    cookiesData: cookiesData
                });
            });
            break;
        case "saveAllLinks":
            getSpecificCookiesForActiveTab(function (cookiesData) {
                chrome.tabs.sendMessage(tabId, {
                    action: 'promptProductName',
                    cookiesData: cookiesData
                });
            });
            break;
        case "selectAllInput":
            chrome.tabs.sendMessage(tabId, {action: 'selectAllInput'});
            break;
        default:
            console.warn(`Unhandled menu item: ${menuItemId}`);
    }
}

// 在扩展安装时调用创建菜单项的函数

// 监听上下文菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab && tab.id !== undefined) {
        handleMenuClick(info.menuItemId, info.linkUrl, tab.id);
    } else {
        console.warn("Invalid tab or tab ID.");
    }
});

// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCookies') {
        getSpecificCookiesForActiveTab(sendResponse);
        return true; // 表示响应是异步的
    }
});

function getSpecificCookiesForActiveTab(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs.length === 0) {
            callback({});
            return;
        }
        const tab = tabs[0];
        const url = new URL(tab.url);

        // 根据域名选择不同的 cookie 名称
        let cookieNames;
        if (url.hostname.endsWith('.xiaohongshu.com')) {
            cookieNames = ['a1', 'web_session'];
        } else if (url.hostname.endsWith('.anotherdomain.com')) {
            cookieNames = ['b2', 'session_id'];
        } else {
            cookieNames = ['default_cookie'];
        }

        let cookiesData = {};
        let pendingCookies = cookieNames.length;

        cookieNames.forEach(function (name) {
            chrome.cookies.get({url: url.origin, name: name}, function (cookie) {
                if (cookie) {
                    cookiesData[name] = cookie.value;
                }
                pendingCookies--;
                if (pendingCookies === 0) {
                    callback(cookiesData);
                }
            });
        });
    });
}
