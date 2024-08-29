function createContextMenuItems(login = false) {
    const documentUrlPatterns = [
        "*://*.xiaohongshu.com/*",
        "*://*.xiaohongshu.cn/*",
        "*://*.bilibili.com/*",
        "*://*.bilibili.cn/*",
        "*://*.douyin.cn/*"
    ];

    const menuItems = login ? [
        {id: "saveLinkCom", title: "保存竞品"},
        {id: "saveLinkComComment", title: "保存竞品-已维护"},
        {id: "saveLinkOwn", title: "保存自发"},
        {id: "saveLinkOwnComment", title: "保存自发-已维护"}
    ] : [
        {id: "LoginFirst", title: "请先登录"}
    ];

    menuItems.forEach(item => {
        item.contexts = ["all"];
        item.documentUrlPatterns = documentUrlPatterns;

        chrome.contextMenus.remove(item.id, () => {
            if (chrome.runtime.lastError) {
                console.warn(`No existing menu item with id ${item.id} to remove.`);
            }
            chrome.contextMenus.create(item, () => {
                if (chrome.runtime.lastError) {
                    console.error(`Error creating menu item: ${chrome.runtime.lastError}`);
                }
            });
        });
    });
}

function updateContextMenu() {
    chrome.storage.local.get(["user_name"], function (result) {
        const login = !!result.user_name;
        createContextMenuItems(login);
    });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.user_name) {
        updateContextMenu();
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateContextMenu();
    }
});

// 初次运行时调用一次以确保上下文菜单的初始状态正确
updateContextMenu();

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
