// 创建上下文菜单项
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "saveLink",
        title: "保存竞品",
        contexts: ["link"]
    });
});

// 监听上下文菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveLink") {
        chrome.tabs.sendMessage(tab.id, { linkUrl: info.linkUrl });
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
    }
});

