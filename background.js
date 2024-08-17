function createContextMenuItems() {
    const documentUrlPatterns = [
        "*://*.xiaohongshu.com/*",
        "*://*.xiaohongshu.cn/*",
        "*://*.bilibili.com/*",
        "*://*.bilibili.cn/*",
        "*://*.douyin.cn/*"
    ];

    const menuItems = [
        {id: "saveLinkCom", title: "保存竞品", contexts: ["all"], documentUrlPatterns},
        {id: "saveLinkComComment", title: "保存竞品-已维护", contexts: ["all"], documentUrlPatterns},
        {id: "saveLinkOwn", title: "保存自发", contexts: ["all"], documentUrlPatterns},
        {id: "saveLinkOwnComment", title: "保存自发-已维护", contexts: ["all"], documentUrlPatterns},

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
    const actions = {
        "saveLinkCom": 'saveLinkCom',
        "saveLinkComComment": 'saveLinkComComment',
        "saveLinkOwn": 'saveLinkOwn',
        "saveLinkOwnComment": 'saveLinkOwnComment'
    };

    if (actions[menuItemId]) {
        getSpecificCookiesForActiveTab(function (cookiesData) {
            chrome.tabs.sendMessage(tabId, {
                action: actions[menuItemId],
                linkUrl: linkUrl,
                cookiesData: cookiesData
            });
        });
    } else {
        console.warn(`Unhandled menu item: ${menuItemId}`);
    }
}

// 监听上下文菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab && tab.id !== undefined) {
        // 获取当前标签页的URL
        chrome.tabs.get(tab.id, (currentTab) => {
            if (currentTab && currentTab.url) {
                handleMenuClick(info.menuItemId, currentTab.url, tab.id);
            } else {
                console.warn("Failed to retrieve the current tab URL.");
            }
        });
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
