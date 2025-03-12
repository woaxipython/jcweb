// content.js
window.onload = function () {
    // 初始化执行函数
    initExecute();
    onUrlChange(() => {
        const url = window.location.href;
        if (url.match(/explore\/[a-zA-Z0-9]+/)) {
            setTimeout(() => {
                const main_bar = $("#mfContainer")
                if (main_bar.length) {
                    makeContainerBar();
                }
            }, 1000); // 延迟1秒等待DOM加载
        }
    })

    // 监听来自背景脚本的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleBackgroundMessage(request);
    });


};

function handleBackgroundMessage(request) {
    let productName;
    switch (request.action) {
        case 'saveLinkOwn':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, false, false);
            break;
        case 'saveLinkOwnComment':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, false, true);
            break;
        default:
            console.warn(`Unhandled action: ${request.action}`);
    }
}
