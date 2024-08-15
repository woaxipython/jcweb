// 创建上下文菜单项
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "selectAllInput",
        title: "全选",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "saveLink",
        title: "保存竞品",
        contexts: ["link"]
    });
    // 新增保存所有已选链接选项
    chrome.contextMenus.create({
        id: "saveAllLinks",
        title: "保存所有已选链接",
        contexts: ["all"]
    });
});

// 监听上下文菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "saveLink":
            chrome.tabs.sendMessage(tab.id, {linkUrl: info.linkUrl});
            break;
        case "saveAllLinks":
            // 调用前端方法，以获取当前所有已选链接
            chrome.tabs.sendMessage(tab.id, {selectedLinks: true});
            break;
        case "initButton":
            chrome.tabs.sendMessage(tab.id, {initButton: true});
        case "selectAllInput":
            chrome.tabs.sendMessage(tab.id, {selectAllInput: true});
        default:
            console.warn(`Unhandled menu item: ${info.menuItemId}`);
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message);

    if (message.productName && message.linkUrl) {

        console.log('Received product name:', message.productName);
        console.log('Received link URL:', message.linkUrl);
        // fetch('https://yourserver.com/api/save-link', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ url: message.linkUrl, product: message.productName })
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Link and product saved successfully:', data);
        //         sendResponse({ status: 'success', data: data });
        //     })
        //     .catch((error) => {
        //         console.error('Error saving link and product:', error); // 打印错误信息
        //         sendResponse({ status: 'error', error: error.toString() }); // 确保将错误信息传递回去
        //     });


        // 返回 true 以指示我们将在异步操作完成后发送响应
        return true;
    } else if (message.selectedLinks) {
        console.log('Received selected links:', message.selectedLinks);
        return true;
    }

});